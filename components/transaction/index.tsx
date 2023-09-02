import { ethers } from 'ethers'
import { CHAIN_DATA, PNT_DECIMALS } from '../../constants'
import { TRANSACTION } from '../../services/transactions'
import { ExternalLink, TransactionIcon } from '../icons'
import Voucher from '../icons/voucher'
import Label from '../label'

interface ITransaction {
	transaction: TRANSACTION
	lastTransaction?: boolean
}

const parseHexTimestamp = (hexTimestamp: string) => {
	return parseInt(hexTimestamp, 16)
}

const displayDate = (hexTimestamp: string) => {
	//const timestampInSeconds = parseHexTimestamp(hexTimestamp)
	const timestampInSeconds = Number(hexTimestamp)
	const date = new Date(timestampInSeconds * 1000)
	const hours = date.getHours()
	const minutes = date.getMinutes()

	return `${hours.toString().length === 1 ? `0${hours}` : hours}:${
		minutes.toString().length === 1 ? `0${minutes}` : minutes
	}`
}

const displayDayLabel = (hexTimestamp: string) => {
	//const timestampInSeconds = parseHexTimestamp(hexTimestamp)
	const timestampInSeconds = Number(hexTimestamp)

	const date = new Date(timestampInSeconds * 1000)
	const currentDate = new Date()

	const transactionDay = date.getDate()
	const currentDay = currentDate.getDate()
	if (currentDay > transactionDay) {
		if (currentDay - transactionDay === 1) {
			return 'Ayer'
		}
	} else if (currentDay < transactionDay) {
		if (transactionDay - currentDay === transactionDay - 1) {
			return 'Ayer'
		}
	} else {
		return 'Hoy'
	}

	return `${date.getDate()}/${date.getMonth() + 1}`
}

const displayHash = (transactionHash: string) => {
	return `${transactionHash.substring(0, 2)}-${transactionHash.substring(
		transactionHash.length - 5
	)}`
}

const Transaction = ({ transaction, lastTransaction }: ITransaction) => {
	const chain = transaction.chain
	let parsedPintas = parseFloat(
		ethers.utils.formatUnits(transaction.data, PNT_DECIMALS)
	)

	return (
		<div
			className={`${
				lastTransaction
					? 'border-l-12 border-lightPrimary gap-2'
					: 'gap-1'
			} flex flex-col  p-6`}
		>
			{lastTransaction && (
				<div className="flex items-center gap-3 mb-6">
					<div className="text-lightPrimary">
						<TransactionIcon />
					</div>
					<Label className="font-bold">Última transacción</Label>
				</div>
			)}
			<div className="flex items-center justify-between font-bold text-black">
				<div
					className={`${
						lastTransaction
							? 'text-labelTitle mobile:text-[20px]'
							: ''
					}`}
				>
					<div className="flex items-center gap-2">
						{transaction.tokenId && (
							<div className="text-[#15BB93]">
								<Voucher />
							</div>
						)}
						<div>
							{transaction.tokenId
								? `Voucher Comida`
								: `${parsedPintas} ${
										parsedPintas === 1 ? 'Pinta' : 'Pintas'
								  }`}
						</div>
					</div>
				</div>
				<div
					className={`${
						lastTransaction
							? 'text-labelTitle mobile:text-[20px]'
							: ''
					} text-right`}
				>
					{displayDate(transaction.timeStamp)}
				</div>
			</div>
			<div className="flex items-center justify-between text-grayText">
				<div>
					<a
						href={`${CHAIN_DATA[chain].transactionScanner}/${transaction.transactionHash}`}
						className="inline-flex items-center gap-2 cursor-pointer external-link"
						target={'_blank'}
						rel={'noreferrer'}
					>
						<div className="transition-all">
							{displayHash(transaction.transactionHash)} -{' '}
							{CHAIN_DATA[chain].name}
						</div>
						<div className="transition-all icon">
							<ExternalLink />
						</div>
					</a>
				</div>
				<div className="text-right">
					<a
						href={`${CHAIN_DATA[chain].transactionScanner}/${transaction.transactionHash}`}
						className="inline-flex items-center gap-2 cursor-pointer"
						target={'_blank'}
						rel={'noreferrer'}
					>
						{displayDayLabel(transaction.timeStamp)}
					</a>
				</div>
			</div>
		</div>
	)
}

export default Transaction

interface ITransactionLoader {
	lastTransaction: boolean
}

export const TransactionLoader = ({ lastTransaction }: ITransactionLoader) => {
	return (
		<div
			className={`${
				lastTransaction
					? 'border-l-12 border-lightPrimary gap-2'
					: 'gap-1'
			} flex flex-col  p-6`}
		>
			{lastTransaction && (
				<div className="inline-flex items-center gap-3 mb-6">
					<div className="inline-flex items-center gap-3 mb-6 overflow-hidden pointer-events-none select-none bg-loading animate-pulse rounded-4">
						<div className="text-loading">
							<TransactionIcon />
						</div>
						<Label className="font-bold text-loading">
							Última transacción
						</Label>
					</div>
				</div>
			)}

			<div
				className={`inline-flex justify-between rounded-4 items-center select-none ${
					lastTransaction
						? 'text-loading bg-loading animate-pulse'
						: 'font-bold'
				}`}
			>
				<div
					className={`${
						lastTransaction
							? 'text-labelTitle mobile:text-[20px]'
							: 'text-loading bg-loading animate-pulse rounded-4'
					}`}
				>
					--------------------
				</div>
				<div
					className={`${
						lastTransaction
							? 'text-labelTitle mobile:text-[20px]'
							: 'text-loading bg-loading animate-pulse rounded-4'
					}`}
				>
					--------------------
				</div>
			</div>
			<div>
				<div className="flex items-center justify-between">
					<div className="text-right select-none rounded-4 text-loading bg-loading animate-pulse">
						<div className="inline-flex items-center gap-2 cursor-pointer">
							------------
						</div>
					</div>
					<div className="text-right select-none rounded-4 text-loading bg-loading animate-pulse">
						<div className="inline-flex items-center gap-2 cursor-pointer">
							------------
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
