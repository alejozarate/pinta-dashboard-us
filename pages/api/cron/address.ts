import {
	query,
	collection,
	where,
	getDocs,
	orderBy,
	limit,
	writeBatch,
	doc,
} from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
	BSC_API_ENDPOINT,
	BSC_CHAIN_ID,
	BSC_PNT_ADDRESS,
	createAddressTopic,
	parseBytes32Address,
	POLYGON_API_ENDPOINT,
	POLYGON_CHAIN_ID,
	POLYGON_PNT_ADDRESS,
} from '../../../utils/chains-constants'
import { convertTimestamps, getFirebaseDB } from '../../../utils/firebase-db'

interface ILog {
	address: string
	blockNumber: string
	data: string
	transactionHash: string
	topics: [string, string, string]
	timeStamp: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { sKey, address } = req.query
		const S_KEY = process.env.S_KEY
		if (!address || typeof address !== 'string' || !sKey || sKey !== S_KEY)
			return res.status(404).json({ message: 'Bad request' })

		const db = getFirebaseDB()

		const POLYGON_WHITELISTED_ADDRESS_TOPIC = createAddressTopic(address)
		const BSC_WHITELISTED_ADDRESS_TOPIC = POLYGON_WHITELISTED_ADDRESS_TOPIC
		const TRANSFER_TOPIC =
			'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

		const polygonQueryConstraints = [
			where('to', '==', address.toLowerCase()),
			where('chain', '==', POLYGON_CHAIN_ID),
			orderBy('timeStamp', 'desc'),
			limit(1),
		]

		const p = query(collection(db, 'logs'), ...polygonQueryConstraints)

		const polygonQuerySnapshot = await getDocs(p)

		let polygonLastBlock: boolean | number = false

		polygonQuerySnapshot.forEach((doc) => {
			const _data = doc.data()
			polygonLastBlock = Number(_data.blockNumber) + 1
		})

		const polygon_response = await fetch(
			`${POLYGON_API_ENDPOINT}?module=logs&action=getLogs&address=${POLYGON_PNT_ADDRESS}&topic0=${TRANSFER_TOPIC}&topic0_2_opr=and&topic2=${POLYGON_WHITELISTED_ADDRESS_TOPIC}&apikey=${
				process.env.POLYGON_API_KEY
			}${polygonLastBlock ? `&fromBlock=${polygonLastBlock}` : ''}`
		)

		const polygon_events = await polygon_response.json()

		const batch = writeBatch(db)

		if (polygon_events['status']) {
			polygon_events.result.forEach((log: ILog) => {
				const ref = doc(db, 'logs', log.transactionHash)

				const parsedFrom = parseBytes32Address(log.topics[1])
				const parsedTo = parseBytes32Address(log.topics[2])

				batch.set(ref, {
					transactionHash: log.transactionHash,
					chain: POLYGON_CHAIN_ID,
					address: log.address,
					data: parseInt(log.data, 16),
					from: parsedFrom,
					to: parsedTo,
					blockNumber: parseInt(log.blockNumber, 16),
					timeStamp: parseInt(log.timeStamp, 16),
				})
			})
		}

		if (polygon_events['status'] && polygon_events['result'].length > 0) {
			await batch.commit()
		}

		const queryConstraints = [
			where('to', '==', address.toLowerCase()),
			orderBy('timeStamp', 'desc'),
			limit(10),
		]

		const q = query(collection(db, 'logs'), ...queryConstraints)

		const querySnapshot = await getDocs(q)
		const last_txs: any[] = []

		querySnapshot.forEach((doc) => {
			const _data = doc.data()
			last_txs.push(_data)
		})

		return res.status(200).json({
			pnt: last_txs,
			fangibles: [],
		})
	} catch (e) {
		console.log(e)
		return res.status(400).json({ message: 'Bad request' })
	}
}
