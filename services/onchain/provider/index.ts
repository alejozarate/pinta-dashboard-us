import { POLYGON_CHAIN_ID } from '../../../utils/chains-constants'
import alchemy from './alchemy'
import polygonscan from './polygonscan'

export const defaultProvider: 'polygonscan' | 'alchemy' = 'alchemy'
export interface DBLog {
	transactionHash: string
	chain: typeof POLYGON_CHAIN_ID
	address: string
	data: number
	from: string
	to: string
	blockNumber: number
	timeStamp: number
}

export default {
	polygonscan,
	alchemy,
}
