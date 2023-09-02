import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { CHAIN_IDENTIFIER } from '../constants'
import { useSession } from './session'

export type TRANSACTION = {
	chain: CHAIN_IDENTIFIER
	data: string
	timeStamp: string
	address: string
	from: string
	to: string
	transactionHash: string
	blockNumber: string
	tokenId?: number
	amount?: number
}

export interface ITransactionContext {
	loading: boolean
	transactions: TRANSACTION[]
	refreshTransactions: Function
	todayBalance: string | undefined
	totalBalance: string | undefined
	fangibleBalance: string | undefined
}

export const TransactionsContext = createContext<ITransactionContext>({
	loading: false,
	transactions: [],
	refreshTransactions: () => {},
	todayBalance: undefined,
	totalBalance: undefined,
	fangibleBalance: undefined,
})

export function useTransactions() {
	return useContext(TransactionsContext)
}

interface ITransactionProps {
	children: ReactNode
}

export const orderTransactions = (
	pntTransactions: any,
	fangibleTransactions: any
) => {
	const unorderedTransactions = [...pntTransactions, ...fangibleTransactions]

	return unorderedTransactions.sort((a, b) => {
		return a.timeStamp > b.timeStamp
			? -1
			: a.timeStamp == b.timeStamp
			? 0
			: 1
	})
}

export const TransactionsProvider = ({ children }: ITransactionProps) => {
	const { JWT, address } = useSession()
	const [loading, setLoading] = useState<boolean>(false)
	const [transactions, setTransactions] = useState<TRANSACTION[]>([])
	const [todayBalance, setTodayBalance] = useState<string | undefined>()
	const [totalBalance, setTotalBalance] = useState<string | undefined>()
	const [fangibleBalance, setFangibleBalance] = useState<string | undefined>()

	useEffect(() => {
		setTransactions([])
	}, [JWT, address])

	const refreshBalance = async () => {
		fetch(`/api/getStats`, {
			headers: {
				Authorization: `Bearer ${JWT}`,
			},
		})
			.then(async (_balances) => {
				const balances = await _balances.json()

				const pnts = balances.pnt

				setTodayBalance(pnts.today)
				setTotalBalance(pnts.total)

				setFangibleBalance(balances.fangibles)
			})
			.catch((e) => {
				console.log(e)
			})
	}

	useEffect(() => {
		if (!JWT || !address) return

		if (loading) return

		refreshTransactions()
	}, [JWT, address])

	const refreshTransactions = async () => {
		if (loading) return

		setLoading(true)

		fetch(`/api/getLastTxs`, {
			headers: {
				Authorization: `Bearer ${JWT}`,
			},
		})
			.then(async (_txs) => {
				const txs = await _txs.json()
				setTransactions(orderTransactions(txs.pnt, []))
				refreshBalance().catch((e) => console.log(e))
			})
			.catch((e) => {
				console.log(e)
				setLoading(false)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const transactionContextProvider = {
		loading,
		transactions,
		refreshTransactions,
		todayBalance,
		totalBalance,
		fangibleBalance,
	}

	return (
		<TransactionsContext.Provider value={transactionContextProvider}>
			{children}
		</TransactionsContext.Provider>
	)
}
