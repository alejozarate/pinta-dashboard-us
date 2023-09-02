import type { NextApiRequest, NextApiResponse } from 'next'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { getFirebaseDB } from '../../utils/firebase-db'
import crypto from 'crypto'
// @ts-ignore
import jwt from 'jsonwebtoken'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const db = getFirebaseDB()

		const { email, password } = req.body

		if (!email || !password)
			return res.status(400).send({ message: 'Bad request' })

		const q = query(
			collection(db, 'users'),
			where('email', '==', email),
			where(
				'password',
				'==',
				crypto.createHash('md5').update(password).digest('hex')
			)
		)
		const querySnapshot = await getDocs(q)

		const docs = querySnapshot.docs[0]
		if (!docs) return res.status(400).json({ message: 'Bad request' })

		const user = docs.data()

		const now = Math.floor(Date.now() / 1000 - 1000)
		const VALID_UNTIL_IN_DAYS = 60

		const payload = {
			iat: now,
			iss: process.env.JWT_SERVER_NAME,
			nbf: now,
			exp: now + 86400 * VALID_UNTIL_IN_DAYS,
			address: user.address,
			label: user.label,
			id: docs.id,
			quantity: user.quantity,
		}

		const signedJWT = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
			algorithm: 'HS512',
		})

		res.status(200).json({
			jwt: signedJWT,
			address: user.address,
		})
	} catch (e) {
		console.log(e)
		res.status(400).json({ message: 'Bad request' })
	}
}
