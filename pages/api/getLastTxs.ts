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
	createAddressTopic,
	parseBytes32Address,
	POLYGON_CHAIN_ID,
	POLYGON_PNT_ADDRESS,
} from '../../utils/chains-constants'
import { convertTimestamps, getFirebaseDB } from '../../utils/firebase-db'
// @ts-ignore
import { verify_session } from '../../utils/verify-jwt'
import onChainProvider, {
	DBLog,
	defaultProvider,
} from '../../services/onchain/provider'

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
		const decoded = await verify_session(req)
		const db = getFirebaseDB()

		const address = decoded.address.toLowerCase()

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

		const polygon_events = await onChainProvider[
			defaultProvider
		].getLastTxs(polygonLastBlock, address)

		const batch = writeBatch(db)

		polygon_events.forEach((log: DBLog) => {
			const ref = doc(db, 'logs', log.transactionHash)

			batch.set(ref, {
				transactionHash: log.transactionHash,
				chain: log.chain,
				address: log.address,
				data: log.data,
				from: log.from,
				to: log.to,
				blockNumber: log.blockNumber,
				timeStamp: log.timeStamp,
			})
		})

		if (polygon_events.length > 0) {
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
