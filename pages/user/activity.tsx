import { NextPage } from 'next'
import Card from '../../components/card'
import TransactionList from '../../components/transaction/list'
import { TransactionIcon } from '../../components/icons'
import { orderTransactions, TRANSACTION } from '../../services/transactions'
import { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import { useSession } from '../../services/session'
import Chart from '../../components/chart'

const Activity: NextPage = () => {
	const { JWT, address } = useSession()
	const [loading, setLoading] = useState<boolean>(false)
	const [transactions, setTransactions] = useState<TRANSACTION[]>([])

	useEffect(() => {
		if (!JWT || !address || loading) return

		setLoading(true)
		fetch(`/api/getActivity`, {
			headers: {
				Authorization: `Bearer ${JWT}`,
			},
		})
			.then(async (_txs) => {
				const txs = await _txs.json()
				setTransactions(orderTransactions(txs.pnt, []))
			})
			.catch((e) => {
				setLoading(false)
				console.log(e)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [JWT, address])
	return (
		<Layout>
			<div className="max-w-[1200px] mx-auto">
				{!loading && (
					<div className="py-2 mb-4">
						<Chart />
					</div>
				)}
				{loading ? (
					<div className="flex items-center justify-center flex-col relative z-0 mt-12">
						<div>
							<svg
								width="64"
								height="64"
								viewBox="0 0 65 64"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="animate-spin"
							>
								<path
									d="M8.64622 34.6666H14.0196C14.6657 39.106 16.8885 43.1644 20.2815 46.0993C23.6745 49.0342 28.0107 50.6494 32.4969 50.6494C36.9831 50.6494 41.3193 49.0342 44.7123 46.0993C48.1052 43.1644 50.3281 39.106 50.9742 34.6666H56.3502C55.6928 40.5329 52.8967 45.9512 48.4963 49.886C44.0959 53.8207 38.3999 55.996 32.4969 55.996C26.5939 55.996 20.8979 53.8207 16.4975 49.886C12.0971 45.9512 9.301 40.5329 8.64355 34.6666H8.64622ZM8.64622 29.3333C9.30367 23.467 12.0998 18.0487 16.5002 14.1139C20.9005 10.1792 26.5965 8.00391 32.4996 8.00391C38.4026 8.00391 44.0986 10.1792 48.499 14.1139C52.8993 18.0487 55.6954 23.467 56.3529 29.3333H50.9796C50.3334 24.8939 48.1106 20.8355 44.7176 17.9006C41.3246 14.9657 36.9884 13.3505 32.5022 13.3505C28.016 13.3505 23.6798 14.9657 20.2868 17.9006C16.8939 20.8355 14.671 24.8939 14.0249 29.3333H8.64622Z"
									fill="#15BB93"
								/>
							</svg>
						</div>
						<div className="font-bold">Cargando</div>
					</div>
				) : (
					<Card>
						<div className="flex gap-3  p-6 border-b border-borderGray">
							<div className="text-grayIcons">
								<TransactionIcon />
							</div>
							<div className="text-primary font-bold">
								Historial de transacciones
							</div>
						</div>
						<TransactionList transactions={transactions} />
					</Card>
				)}
			</div>
		</Layout>
	)
}

export default Activity
