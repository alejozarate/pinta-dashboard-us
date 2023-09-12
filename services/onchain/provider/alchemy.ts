import {
	Alchemy,
	Network,
	AssetTransfersCategory,
	SortingOrder,
	AssetTransfersWithMetadataResult,
} from 'alchemy-sdk'
import { DBLog } from '.'
import {
	POLYGON_CHAIN_ID,
	POLYGON_PNT_ADDRESS,
} from '../../../utils/chains-constants'
import { getBalance } from './polygonscan'

const config = {
	apiKey: process.env.ALCHEMY_API_KEY,
	network: Network.MATIC_MAINNET,
}

const alchemy = new Alchemy(config)

const getLastTxs = async (
	polygonLastBlock: number | boolean,
	address: string
): Promise<DBLog[]> => {
	const polygon_events = await alchemy.core.getAssetTransfers({
		fromBlock:
			typeof polygonLastBlock === 'number'
				? `0x${polygonLastBlock.toString(16)}`
				: '0x0',
		toAddress: address,
		category: [AssetTransfersCategory.ERC20],
		contractAddresses: [POLYGON_PNT_ADDRESS],
		order: SortingOrder.DESCENDING,
		withMetadata: true,
	})

	return polygon_events.transfers.map(
		(log: AssetTransfersWithMetadataResult) => {
			return {
				transactionHash: log.hash,
				chain: POLYGON_CHAIN_ID,
				address: POLYGON_PNT_ADDRESS,
				data: parseInt(log.rawContract.value || '0', 16),
				from: log.from,
				to: log.to || address,
				blockNumber: parseInt(log.blockNum, 16),
				timeStamp:
					new Date(log.metadata.blockTimestamp).getTime() / 1000,
			}
		}
	)
}

export default {
	getBalance: getBalance,
	getLastTxs,
}
