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
import onChainProvider, {
	defaultProvider,
} from '../../services/onchain/provider'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const decoded = await verify_session(req)
		const db = getFirebaseDB()

		const address = decoded.address.toLowerCase()

		const polygon_balance = await onChainProvider[
			defaultProvider
		].getBalance(address)

		let totalBalance = 0

		totalBalance += polygon_balance

		const timestamp = Date.now() // divide by 1000 to get the Unix timestamp in seconds

		const dtNow = new Date(timestamp) // multiply by 1000 to get the timestamp in milliseconds
		// Set a non-default timezone if needed
		dtNow.toLocaleString('en-US', {
			timeZone: 'America/Argentina/Buenos_Aires',
		})

		// Working are hours from 10am to 4am of next day
		const currentHour = dtNow.getHours()
		const beginOfDay = new Date(dtNow)
		let endOfDay
		if (currentHour >= 0 && currentHour <= 6) {
			beginOfDay.setDate(beginOfDay.getDate() - 1)
			beginOfDay.setHours(10)

			endOfDay = new Date(beginOfDay)
			endOfDay.setDate(endOfDay.getDate() + 1)
			endOfDay.setHours(8)
		} else {
			beginOfDay.setHours(7)

			endOfDay = new Date(beginOfDay)
			endOfDay.setDate(endOfDay.getDate() + 1)
		}

		const queryConstraints = [
			where('to', '==', address.toLowerCase()),
			where('timeStamp', '>', Math.floor(beginOfDay.getTime() / 1000)),
			where('timeStamp', '<', Math.floor(endOfDay.getTime() / 1000)),
			orderBy('timeStamp', 'desc'),
		]

		const q = query(collection(db, 'logs'), ...queryConstraints)

		const querySnapshot = await getDocs(q)

		let todayBalance = 0

		querySnapshot.forEach((doc) => {
			const _data = doc.data()
			const data = _data.data

			todayBalance += Number(data)
		})

		return res.status(200).json({
			pnt: {
				today: todayBalance,
				total: totalBalance,
			},
			fangibles: 0,
		})
	} catch (e) {
		console.log(e)
		return res.status(400).json({ message: 'Bad request' })
	}
}
