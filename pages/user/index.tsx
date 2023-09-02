import { ethers } from 'ethers'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect } from 'react'
import Card from '../../components/card'
import { BSC, Information, Polygon, Stats } from '../../components/icons'
import Label from '../../components/label'
import Layout from '../../components/layout'
import Transaction, { TransactionLoader } from '../../components/transaction'
import TransactionList, {
	TransactionListLoader,
} from '../../components/transaction/list'
import { CHAIN_DATA, PNT_DECIMALS } from '../../constants'
import { useSession } from '../../services/session'
import { useTransactions } from '../../services/transactions'

const Home: NextPage = () => {
	const { address, quantity } = useSession()
	const { transactions, todayBalance, totalBalance, loading } =
		useTransactions()
	useEffect(() => {}, [transactions, todayBalance, totalBalance, address])
	return (
		<Layout>
			<div className="flex gap-3 mobile:gap-6 laptop:flex-col-reverse max-w-[1200px] mx-auto">
				<div className="flex flex-col gap-3 flex-3">
					{loading && (
						<Card>
							<TransactionLoader lastTransaction={true} />
						</Card>
					)}
					{transactions.length > 0 && !loading && (
						<Card>
							<Transaction
								transaction={transactions[0]}
								lastTransaction={true}
							/>
						</Card>
					)}
					<Card>
						{loading && <TransactionListLoader />}
						{!loading && (
							<TransactionList
								transactions={transactions.slice(1, 6)}
							/>
						)}
					</Card>
					<div className="w-full gap-3 font-bold text-black mobile:flex hidden">
						<a
							href={`${CHAIN_DATA[137].addressScanner}/${address}#tokentxns`}
							className="flex flex-1 gap-2 items-center justify-center cursor-pointer"
							rel="noreferrer"
							target={'_blank'}
						>
							<Card className="p-4 flex-1 flex gap-2 items-center justify-center">
								<div>
									<Polygon />
								</div>
								<Label>
									<span className="text-sm">
										Polygon Scan
									</span>
								</Label>
							</Card>
						</a>
						<a
							className="flex flex-1 gap-2 items-center justify-center cursor-pointer"
							href={`${CHAIN_DATA[56].addressScanner}/${address}#tokentxns`}
							rel="noreferrer"
							target={'_blank'}
						>
							<Card className="p-4 flex-1 flex gap-2 items-center justify-center">
								<div>
									<BSC />
								</div>
								<Label className="text-sm">BSC Scan</Label>
							</Card>
						</a>
					</div>
					<div className="flex items-center justify-center mt-6">
						<Link href="/user/activity">
							<span className="text-grayText font-bold cursor-pointer">
								See all activity
							</span>
						</Link>
					</div>
				</div>
				<div className="flex-2 flex flex-col gap-3">
					<Card className="p-6 flex flex-col gap-6">
						<div className="flex items-center gap-3">
							<div>
								<Information />
							</div>
							<Label className="font-bold text-black">
								General information
							</Label>
						</div>
						<div className="flex flex-col gap-3">
							<div className="flex gap-3">
								<div>
									<Stats />
								</div>
								<div className="flex flex-col gap-1">
									<Label className="font-bold text-black text-labelTitle mobile:text-[20px]">
										{todayBalance
											? Number(
													ethers.utils.formatUnits(
														todayBalance,
														PNT_DECIMALS
													)
											  ).toFixed(2)
											: '-'}
									</Label>
									<Label className="text-grayText">
										PNT today
									</Label>
								</div>
							</div>
							<hr className="my-2" />
							<div className="flex gap-3">
								<div>
									<Stats />
								</div>
								<div className="flex flex-col gap-1">
									<Label className="font-bold text-black text-labelTitle mobile:text-[20px]">
										{totalBalance
											? Number(
													ethers.utils.formatUnits(
														totalBalance,
														PNT_DECIMALS
													)
											  ).toFixed(2)
											: '-'}{' '}
										/ {quantity || '-'}
									</Label>
									<Label className="text-grayText">
										PNT total
									</Label>
								</div>
							</div>
						</div>
					</Card>
					<div className="flex desktop:flex-col desktop:gap-2 w-full gap-3 font-bold text-black mobile:hidden">
						<a
							href={`${CHAIN_DATA[137].addressScanner}/${address}#tokentxns`}
							className="flex flex-1 gap-2 items-center justify-center cursor-pointer hover:-translate-y-[2px] transition-all"
							rel="noreferrer"
							target={'_blank'}
						>
							<Card className="p-4 flex-1 flex gap-2 items-center justify-center ">
								<div>
									<Polygon />
								</div>
								<Label>
									<span className="text-sm">
										Polygon Scan
									</span>
								</Label>
							</Card>
						</a>
						<a
							className="flex flex-1 gap-2 items-center justify-center cursor-pointer hover:-translate-y-[2px] transition-all"
							href={`${CHAIN_DATA[56].addressScanner}/${address}#tokentxns`}
							rel="noreferrer"
							target={'_blank'}
						>
							<Card className="p-4 flex-1 flex gap-2 items-center justify-center ">
								<div>
									<BSC />
								</div>
								<Label className="text-sm">BSC Scan</Label>
							</Card>
						</a>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Home
