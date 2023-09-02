import {
	query,
	collection,
	where,
	getDocs,
	orderBy,
	limit,
	writeBatch,
	doc,
} from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
	BSC_API_ENDPOINT,
	BSC_CHAIN_ID,
	BSC_PNT_ADDRESS,
	createAddressTopic,
	parseBytes32Address,
	POLYGON_API_ENDPOINT,
	POLYGON_CHAIN_ID,
	POLYGON_PNT_ADDRESS,
} from '../../utils/chains-constants'
import { getFirebaseDB } from '../../utils/firebase-db'

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { sKey } = req.query
		const S_KEY = process.env.S_KEY
		if (!sKey || sKey !== S_KEY)
			return res.status(404).json({ message: 'Bad request' })

		const db = getFirebaseDB()

		const q = query(collection(db, 'users'))

		const querySnapshot = await getDocs(q)

		querySnapshot.forEach((doc) => {
			const user = doc.data()

			fetch(
				`https://pinta-dashboard-us.vercel.app/api/cron/address?address=${user.address}&sKey=${S_KEY}`,
				{
					keepalive: true,
				}
			)
		})

		await sleep(2000)

		console.log('Processed cron')
		return res.status(200).json({ message: 'OK' })
	} catch (e) {
		console.log(e)
		return res.status(400).json({ message: 'Bad request' })
	}
}
