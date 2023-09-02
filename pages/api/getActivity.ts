import {
	query,
	collection,
	where,
	getDocs,
	orderBy,
	limit,
} from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirebaseDB } from '../../utils/firebase-db'
// @ts-ignore
import { verify_session } from '../../utils/verify-jwt'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const decoded = await verify_session(req)
		const db = getFirebaseDB()

		const queryConstraints = [
			where('to', '==', decoded.address.toLowerCase()),
			orderBy('timeStamp', 'desc'),
			limit(100),
		]

		const q = query(collection(db, 'logs'), ...queryConstraints)

		const querySnapshot = await getDocs(q)
		const logs: any[] = []

		querySnapshot.forEach((doc) => {
			const log = doc.data()
			logs.push(log)
		})

		return res.status(200).json({ pnt: logs, fangibles: [] })
	} catch (e) {
		console.log(e)
		return res.status(400).json({ message: 'Bad request' })
	}
}
