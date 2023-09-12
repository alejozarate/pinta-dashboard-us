import { DBLog } from '.'
import { TRANSFER_TOPIC } from '../../../constants'
import {
	POLYGONSCAN_POLYGON_API_ENDPOINT,
	POLYGON_CHAIN_ID,
	POLYGON_PNT_ADDRESS,
	createAddressTopic,
	parseBytes32Address,
} from '../../../utils/chains-constants'

interface ILog {
	address: string
	blockNumber: string
	data: string
	transactionHash: string
	topics: [string, string, string]
	timeStamp: string
}

export const getBalance = async (address: string): Promise<number> => {
	let result = 0
	try {
		const polygon_response = await fetch(
			`${POLYGONSCAN_POLYGON_API_ENDPOINT}?module=account&action=tokenbalance&tag=latest&contractaddress=${POLYGON_PNT_ADDRESS}&address=${address}&apikey=${process.env.POLYGON_API_KEY}`
		)

		const polygon_balance = await polygon_response.json()

		if (polygon_balance['status'] && polygon_balance['result']) {
			result = Number(polygon_balance['result'])
		}
	} catch (e) {
		console.log(`Error fetching PolygonScan balance`, e)
	}
	return result
}

const getLastTxs = async (
	polygonLastBlock: number | false,
	address: string
): Promise<DBLog[]> => {
	const addressTopic = createAddressTopic(address)
	const polygon_response = await fetch(
		`${POLYGONSCAN_POLYGON_API_ENDPOINT}?module=logs&action=getLogs&address=${POLYGON_PNT_ADDRESS}&topic0=${TRANSFER_TOPIC}&topic0_2_opr=and&topic2=${addressTopic}&apikey=${
			process.env.POLYGON_API_KEY
		}${polygonLastBlock ? `&fromBlock=${polygonLastBlock}` : ''}`
	)

	const polygon_events = await polygon_response.json()
	if (!polygon_events['status']) return []

	return polygon_events.result.map((log: ILog) => {
		const parsedFrom = parseBytes32Address(log.topics[1])
		const parsedTo = parseBytes32Address(log.topics[2])

		return {
			transactionHash: log.transactionHash,
			chain: POLYGON_CHAIN_ID,
			address: log.address,
			data: parseInt(log.data, 16),
			from: parsedFrom,
			to: parsedTo,
			blockNumber: parseInt(log.blockNumber, 16),
			timeStamp: parseInt(log.timeStamp, 16),
		}
	})
}

export default {
	getBalance,
	getLastTxs,
}
