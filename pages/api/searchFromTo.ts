import { query, collection, where, getDocs, orderBy } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirebaseDB } from '../../utils/firebase-db'
// @ts-ignore
import { verify_session } from '../../utils/verify-jwt'
import moment from 'moment'

// Define the day start and end times as UTC timestamps
const DAY_START_HOUR = 7 // 10am in Argentina
const DAY_END_HOUR = 1 // 4am in Argentina of the next day

// Define a function to get the day start and end timestamps for a given date
export function getDayRange(date: number | string) {
	const dayStartTimestamp = new Date(date)
	dayStartTimestamp.setUTCHours(DAY_START_HOUR, 0, 0, 0) // Set the day start time to 10am
	const dayEndTimestamp = new Date(dayStartTimestamp)
	dayEndTimestamp.setUTCDate(dayEndTimestamp.getUTCDate() + 1) // Add 1 day to get the end of the day
	dayEndTimestamp.setUTCHours(DAY_END_HOUR, 0, 0, 0) // Set the day end time to 4am of the next day
	return {
		start: dayStartTimestamp,
		end: dayEndTimestamp,
	}
}

function getDaysArray(from: number, to: number) {
	const fromDate = new Date(from)
	const toDate = new Date(Number(to))

	// Calculate the number of days between the from and to dates
	const days =
		moment(toDate.getTime()).diff(moment(fromDate.getTime()), 'days') + 1

	// Initialize an empty result array
	const result = []

	// Iterate over each day in the date range and add an object with the date and value 0 to the result array
	for (let i = 0; i < days; i++) {
		const date = moment(from).add(i, 'days')
		const formattedDate = date.format('D/M/YYYY')
		result.push({ day: formattedDate, amount: 0 })
	}

	return result
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const decoded = await verify_session(req)
		const db = getFirebaseDB()

		const address = decoded.address.toLowerCase()

		const { from, to } = req.query

		if (!from || !to)
			return res.status(400).json({ message: 'Bad request' })

		const fromRange = getDayRange(Number(from))
		const toRange = getDayRange(Number(to))

		const result = getDaysArray(Number(from), Number(to))

		const queryConstraints = [
			where('to', '==', address.toLowerCase()),
			where(
				'timeStamp',
				'>',
				Math.floor(fromRange.start.getTime() / 1000)
			),
			where('timeStamp', '<', Math.floor(toRange.end.getTime() / 1000)),
			orderBy('timeStamp', 'desc'),
		]

		const q = query(collection(db, 'logs'), ...queryConstraints)

		const querySnapshot = await getDocs(q)

		querySnapshot.forEach((doc) => {
			const _data = doc.data()
			const data = _data.data

			const daysRange = getDayRange(Number(_data.timeStamp) * 1000)

			// Calculate the number of days between the from and to dates
			const index = moment(daysRange.start.getTime()).diff(
				moment(Number(from)),
				'days'
			)

			if (!result[index]) return

			result[index] = {
				day: result[index]['day'],
				amount: result[index]['amount'] + parseInt(data),
			}
		})

		return res.status(200).json(result)
	} catch (e) {
		console.log(e)
		return res.status(400).json({ message: 'Bad request' })
	}
}
