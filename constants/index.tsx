import { TRANSACTION as TRANSACTION_TYPE } from '../services/transactions'

export const WHITELISTED_ADDRESS = '0x2e5fbd3255ed182cfc362787b463d5102632d3d4'
export const TRANSFER_TOPIC =
	'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
export type CHAIN_IDENTIFIER = 56 | 137

type CHAIN_DATA_TYPE = {
	transactionScanner: string
	addressScanner: string
	name: 'Polygon' | 'BSC'
}
export const CHAIN_DATA: Record<CHAIN_IDENTIFIER, CHAIN_DATA_TYPE> = {
	137: {
		transactionScanner: 'https://polygonscan.com/tx',
		addressScanner: 'https://polygonscan.com/address',
		name: 'Polygon',
	},
	56: {
		transactionScanner: 'https://bscscan.com/tx',
		addressScanner: 'https://bscscan.com/address',
		name: 'BSC',
	},
}

export const PNT_DECIMALS = 10

export const transactions: TRANSACTION_TYPE[] = []
