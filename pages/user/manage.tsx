import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Button from '../../components/button'
import Card from '../../components/card'
import RankingIcon from '../../components/icons/ranking'
import Layout from '../../components/layout'
import { useSession } from '../../services/session'

export interface IUser {
	id: string
	email: string
	address: string
	label: string
	quantity: string
	created_at: string
}

const Manage: NextPage = () => {
	const { JWT, isAdmin } = useSession()

	const [users, setUsers] = useState<IUser[]>([])

	useEffect(() => {
		fetch(`/api/getUsers`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${JWT}`,
			},
		})
			.then(async (response) => {
				const data = await response.json()
				console.log(data)
				setUsers(data)
			})
			.catch((e) => {
				console.log(e)
				setUsers([])
			})
			.finally(() => {})
	}, [])
	return (
		<Layout>
			<Card>
				<div className="flex gap-3 p-6 border-b border-borderGray">
					<div className="text-grayIcons">
						<RankingIcon />
					</div>
					<div className="font-bold text-primary">Active users</div>
				</div>
				<div className="">
					{users.length === 0 && (
						<div className="items-center justify-center p-6 text-center">
							There are no active users
						</div>
					)}
					{users &&
						users.map &&
						users.map((user, i) => {
							const lastUser = i === users.length - 1
							return (
								<div
									key={`${user.address}_${i}`}
									className={`flex justify-between p-6 ${
										lastUser
											? ''
											: 'border-b-1 border-borderGray'
									}`}
								>
									<div className="flex justify-between gap-6">
										<div className="flex flex-col gap-1">
											<div className="font-bold">
												{user.label}
											</div>
											<div className="text-grayText">
												{user.email}
											</div>
										</div>
									</div>
									<div>
										<Link
											href={{
												pathname: `/user/update/[id]`,
												query: {
													id: user.id,
													address: user.address,
													label: user.label,
													email: user.email,
													created_at: user.created_at,
													quantity: user.quantity,
												},
											}}
										>
											<Button className="text-grayText font-bold px-0">
												Edit
											</Button>
										</Link>
									</div>
								</div>
							)
						})}
					<div className="flex flex-row-reverse  justify-between p-6 border-t-1 border-borderGray">
						<div className="">
							<Link href={'/user/create'}>
								<Button className="text-white bg-[#034030] opacity-100 py-4 px-12 transition-all font-bold">
									Create user
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</Card>
			<div></div>
		</Layout>
	)
}

export default Manage
