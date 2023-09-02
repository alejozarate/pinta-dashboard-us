import { collection, addDoc } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirebaseDB } from '../../utils/firebase-db'
// @ts-ignore
import { verify_session } from '../../utils/verify-jwt'
import crypto from 'crypto'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const decoded = await verify_session(req)

		if (
			decoded.address.toLowerCase() !==
			process.env.ADMIN_ADDRESS?.toLowerCase()
		)
			return res.status(403).json({ message: 'Unauthorized' })

		const db = getFirebaseDB()

		const { email, address, label, password, quantity } = req.body

		if (!email || !address || !label || !password)
			return res.status(400).json({ message: 'Bad request' })

		const userData: any = {
			email,
			address: address.toLowerCase(),
			label,
			password: crypto.createHash('md5').update(password).digest('hex'),
			quantity,
		}

		await addDoc(collection(db, 'users'), userData)

		return res.status(200).json({ status: 'OK' })
	} catch (e) {
		return res.status(400).json({ message: 'Bad request' })
	}
}
