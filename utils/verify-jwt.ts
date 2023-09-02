import { NextApiRequest } from 'next'
// @ts-ignore
import jwt from 'jsonwebtoken'

export const verify_session = async (req: NextApiRequest) => {
	const auth = req.headers.authorization
	if (!auth) throw new Error('Bad request')

	const _jwt = auth.split(' ')[1]
	if (!_jwt) throw new Error('Bad request')

	try {
		const decoded = await jwt.verify(_jwt, process.env.JWT_SECRET_KEY, {
			algorithm: 'HS512',
		})
		if (decoded) {
			return decoded
		}
	} catch (e) {
		console.log(e)
		throw new Error('Bad request')
	}
}
