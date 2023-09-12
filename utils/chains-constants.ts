export const POLYGONSCAN_POLYGON_API_ENDPOINT =
	'https://api.polygonscan.com/api'
export const ALCHEMY_POLYGON_API_ENDPOINT =
	'https://polygon-mainnet.g.alchemy.com/v2'
export const POLYGON_PNT_ADDRESS = '0x17e5F55Bd60758fAbf5957816144Df167e46b9c0'
export const POLYGON_CHAIN_ID = 137

export function parseBytes32Address(bytes32address: string) {
	const without0x = bytes32address.slice(26)
	return '0x' + without0x
}

export function createAddressTopic(address: string) {
	return '0x000000000000000000000000' + address.slice(2)
}
