import {
	query,
	collection,
	where,
	getDocs,
	orderBy,
	limit,
} from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
	BSC_API_ENDPOINT,
	BSC_PNT_ADDRESS,
	POLYGON_API_ENDPOINT,
	POLYGON_PNT_ADDRESS,
} from '../../utils/chains-constants'
import { convertTimestamps, getFirebaseDB } from '../../utils/firebase-db'
// @ts-ignore
import { verify_session } from '../../utils/verify-jwt'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const decoded = await verify_session(req)
		const db = getFirebaseDB()

		const address = decoded.address.toLowerCase()

		const polygon_response = await fetch(
			`${POLYGON_API_ENDPOINT}?module=account&action=tokenbalance&tag=latest&contractaddress=${POLYGON_PNT_ADDRESS}&address=${address}&apikey=${process.env.POLYGON_API_KEY}`
		)
		const bsc_response = await fetch(
			`${BSC_API_ENDPOINT}?module=account&action=tokenbalance&tag=latest&contractaddress=${BSC_PNT_ADDRESS}&address=${address}&apikey=${process.env.BSC_API_KEY}`
		)

		const polygon_balance = await polygon_response.json()
		const bsc_balance = await bsc_response.json()

		let totalBalance = 0

		if (polygon_balance['status'] && polygon_balance['result']) {
			totalBalance += Number(polygon_balance['result'])
		}

		if (bsc_balance['status'] && bsc_balance['result']) {
			totalBalance += Number(bsc_balance['result'])
		}

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
