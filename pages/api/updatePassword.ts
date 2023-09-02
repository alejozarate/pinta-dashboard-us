import { doc, updateDoc } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirebaseDB } from '../../utils/firebase-db'
// @ts-ignore
import { verify_session } from '../../utils/verify-jwt'
import crypto from 'crypto'

interface IUser {
	id: number
	email: string
	address: string
	label: string
	created_at: number
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const decoded = await verify_session(req)

		const id = decoded.id

		const db = getFirebaseDB()

		const { password } = req.body

		if (!id || !password)
			return res.status(400).json({ message: 'Bad request' })

		const userRef = doc(db, 'users', id)

		const userData: any = {
			password: crypto.createHash('md5').update(password).digest('hex'),
		}

		await updateDoc(userRef, userData)

		return res.status(200).json({ status: 'OK' })
	} catch (e) {
		return res.status(400).json({ message: 'Bad request' })
	}
}
