export const POLYGON_API_ENDPOINT = 'https://api.polygonscan.com/api'
export const POLYGON_PNT_ADDRESS = '0x9Ae69fDfF2FA97e34B680752D8E70dfD529Ea6ca'
export const POLYGON_CHAIN_ID = 137

export const BSC_API_ENDPOINT = 'https://api.bscscan.com/api'
export const BSC_PNT_ADDRESS = '0xeaed1C1c9ABC4096CA07247D570a5b34906c73d8'
export const BSC_CHAIN_ID = 56

export function parseBytes32Address(bytes32address: string) {
	const without0x = bytes32address.slice(26)
	return '0x' + without0x
}

export function createAddressTopic(address: string) {
	return '0x000000000000000000000000' + address.slice(2)
}
