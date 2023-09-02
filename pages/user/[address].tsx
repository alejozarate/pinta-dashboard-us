import { ethers } from 'ethers'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect } from 'react'
import Card from '../../components/card'
import { BSC, Information, Polygon, Stats } from '../../components/icons'
import Label from '../../components/label'
import Transaction, { TransactionLoader } from '../../components/transaction'
import TransactionList, {
	TransactionListLoader,
} from '../../components/transaction/list'
import { CHAIN_DATA, PNT_DECIMALS } from '../../constants'
import { useTransactions } from '../../services/transactions'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
	const { transactions, todayBalance, totalBalance, loading } =
		useTransactions()

  const router = useRouter();
  const { address } = router.query;

	useEffect(() => {}, [transactions, todayBalance, totalBalance])
	return (
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
				<div className="hidden w-full gap-3 font-bold text-black mobile:flex">
					<a
						href={`${CHAIN_DATA[137].addressScanner}/${address}#tokentxns`}
						className="flex items-center justify-center flex-1 gap-2 cursor-pointer"
						rel="noreferrer"
						target={'_blank'}
					>
						<Card className="flex items-center justify-center flex-1 gap-2 p-4">
							<div>
								<Polygon />
							</div>
							<Label>
								<span className="text-sm">Polygon Scan</span>
							</Label>
						</Card>
					</a>
					<a
						className="flex items-center justify-center flex-1 gap-2 cursor-pointer"
						href={`${CHAIN_DATA[56].addressScanner}/${address}#tokentxns`}
						rel="noreferrer"
						target={'_blank'}
					>
						<Card className="flex items-center justify-center flex-1 gap-2 p-4">
							<div>
								<BSC />
							</div>
							<Label className="text-sm">BSC Scan</Label>
						</Card>
					</a>
				</div>
				<div className="flex items-center justify-center mt-6">
					<Link href="/activity">
						<span className="font-bold cursor-pointer text-grayText">
							Ver actividad completa
						</span>
					</Link>
				</div>
			</div>
			<div className="flex flex-col gap-3 flex-2">
				<Card className="flex flex-col gap-6 p-6">
					<div className="flex items-center gap-3">
						<div>
							<Information />
						</div>
						<Label className="font-bold text-black">
							Información general
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
										? ethers.utils.formatUnits(
												todayBalance,
												PNT_DECIMALS
										  )
										: '-'}
								</Label>
								<Label className="text-grayText">
									Pintas hoy
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
										? ethers.utils.formatUnits(
												totalBalance,
												PNT_DECIMALS
										  )
										: '-'}
								</Label>
								<Label className="text-grayText">
									Pintas totales
								</Label>
							</div>
						</div>
					</div>
				</Card>
				<div className="flex w-full gap-3 font-bold text-black desktop:flex-col desktop:gap-2 mobile:hidden">
					<a
						href={`${CHAIN_DATA[137].addressScanner}/${address}#tokentxns`}
						className="flex flex-1 gap-2 items-center justify-center cursor-pointer hover:-translate-y-[2px] transition-all"
						rel="noreferrer"
						target={'_blank'}
					>
						<Card className="flex items-center justify-center flex-1 gap-2 p-4 ">
							<div>
								<Polygon />
							</div>
							<Label>
								<span className="text-sm">Polygon Scan</span>
							</Label>
						</Card>
					</a>
					<a
						className="flex flex-1 gap-2 items-center justify-center cursor-pointer hover:-translate-y-[2px] transition-all"
						href={`${CHAIN_DATA[56].addressScanner}/${address}#tokentxns`}
						rel="noreferrer"
						target={'_blank'}
					>
						<Card className="flex items-center justify-center flex-1 gap-2 p-4 ">
							<div>
								<BSC />
							</div>
							<Label className="text-sm">BSC Scan</Label>
						</Card>
					</a>
				</div>
			</div>
		</div>
	)
}

export default Home
