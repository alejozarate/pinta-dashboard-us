import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export const getFirebaseDB = () => {
	const firebaseConfig = {
		apiKey: process.env.FIREBASE_API_KEY,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN,
		projectId: process.env.FIREBASE_PROJECT_ID,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.FIREBASE_APP_ID,
	}

	const firebaseApp = initializeApp(firebaseConfig)
	const db = getFirestore(firebaseApp)

	return db
}

export function convertTimestamps(fromTimestamp: string, toTimestamp: string) {
	// Convert the timestamps to Date objects in UTC
	const fromDate = new Date(Number(fromTimestamp))
	const toDate = new Date(Number(toTimestamp))

	console.log({ fromDate, toDate })

	// Set the time zone to Argentina Buenos Aires
	const timeZone = 'America/Argentina/Buenos_Aires'

	// Convert the dates to local time in Buenos Aires
	const fromLocalDate = new Date(
		fromDate.toLocaleString('en-US', { timeZone })
	)
	const toLocalDate = new Date(toDate.toLocaleString('en-US', { timeZone }))

	// Set the time to 10am for the from date
	fromLocalDate.setHours(10, 0, 0, 0)

	// Set the time to 4am for the next day for the to date
	toLocalDate.setDate(toLocalDate.getDate() + 1)
	toLocalDate.setHours(4, 0, 0, 0)

	// Convert the dates back to UTC
	const fromTimezone = fromLocalDate.getTime() / 1000
	const toTimezone = toLocalDate.getTime() / 1000

	return { fromTimezone, toTimezone }
}
