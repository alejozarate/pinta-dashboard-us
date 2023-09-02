import {
	query,
	collection,
	where,
	getDocs,
	orderBy,
	limit,
} from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { convertTimestamps, getFirebaseDB } from '../../utils/firebase-db'
// @ts-ignore
import { verify_session } from '../../utils/verify-jwt'
import { getDayRange } from './searchFromTo'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const decoded = await verify_session(req)
		const db = getFirebaseDB()

		const { from, to } = req.query

		if (!from || !to)
			return res.status(400).json({ message: 'Bad request' })

		const fromTimezone = getDayRange(Number(from))
		const toTimezone = getDayRange(Number(to))

		const queryConstraints = [
			where('to', '==', decoded.address.toLowerCase()),
			where(
				'timeStamp',
				'>',
				Math.floor(fromTimezone.start.getTime() / 1000)
			),
			where(
				'timeStamp',
				'<',
				Math.floor(toTimezone.end.getTime() / 1000)
			),
			orderBy('timeStamp'),
			orderBy('from'),
		]

		const q = query(collection(db, 'logs'), ...queryConstraints)

		const querySnapshot = await getDocs(q)

		const rankingByFrom: Record<
			string,
			{
				total: number
				address: string
			}
		> = {}

		querySnapshot.forEach((doc) => {
			const _data = doc.data()
			const from = _data.from
			const data = _data.data

			if (rankingByFrom[from]) {
				rankingByFrom[from].total += Number(data)
			} else {
				rankingByFrom[from] = {
					total: Number(data),
					address: from,
				}
			}
		})

		const rankingOrdered = Object.entries(rankingByFrom).sort((a, b) => {
			return b[1].total - a[1].total
		})

		const ranking = rankingOrdered.map((v) => v[1])

		return res.status(200).json(ranking)
	} catch (e) {
		console.log(e)
		return res.status(400).json({ message: 'Bad request' })
	}
}
