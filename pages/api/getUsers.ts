import { query, collection, where, getDocs } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirebaseDB } from '../../utils/firebase-db'
// @ts-ignore
import { verify_session } from '../../utils/verify-jwt'

interface IUser {
	id: string
	email: string
	address: string
	label: string
	created_at: number
	quantity: number
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

		const q = query(collection(db, 'users'))

		const querySnapshot = await getDocs(q)
		const users: IUser[] = []

		querySnapshot.forEach((doc) => {
			const user = doc.data()
			users.push({
				id: doc.id,
				email: user.email,
				address: user.address,
				label: user.label,
				created_at: user.created_at,
				quantity: user.quantity || 0,
			})
		})

		return res.status(200).json(users)
	} catch (e) {
		return res.status(400).json({ message: 'Bad request' })
	}
}
