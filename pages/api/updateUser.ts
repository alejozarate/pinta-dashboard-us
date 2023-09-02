import {
	query,
	collection,
	where,
	getDocs,
	doc,
	updateDoc,
} from 'firebase/firestore'
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

		if (
			decoded.address.toLowerCase() !==
			process.env.ADMIN_ADDRESS?.toLowerCase()
		)
			return res.status(403).json({ message: 'Unauthorized' })

		const db = getFirebaseDB()

		const { id, email, address, label, password, quantity } = req.body

		if (!id || !email || !address || !label)
			return res.status(400).json({ message: 'Bad request' })

		const userRef = doc(db, 'users', id)

		const userData: any = {
			id,
			email,
			address: address.toLowerCase(),
			label,
			quantity,
		}

		if (password) {
			userData['password'] = crypto
				.createHash('md5')
				.update(password)
				.digest('hex')
		}

		await updateDoc(userRef, userData)

		return res.status(200).json({ status: 'OK' })
	} catch (e) {
		return res.status(400).json({ message: 'Bad request' })
	}
}
