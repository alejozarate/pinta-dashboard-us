import type { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { verify_session } from '../../utils/verify-jwt'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const decoded = await verify_session(req)
		return res.status(200).json({ status: 'OK' })
	} catch (e) {
		return res.status(400).json({ message: 'Bad request' })
	}
}
