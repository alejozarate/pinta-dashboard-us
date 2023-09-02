import Transaction, { TransactionLoader } from './index'
import { TRANSACTION } from '../../services/transactions'

interface ITransactionList {
	transactions: TRANSACTION[]
}

const TransactionList = ({ transactions }: ITransactionList) => {
	return (
		<>
			{transactions.map((transaction, i) => {
				const lastTransaction = i === transactions.length - 1
				return (
					<div
						key={`${transaction.transactionHash}_${i}`}
						className={`${
							lastTransaction
								? ''
								: 'border-b-1 border-borderGray'
						}`}
					>
						<Transaction transaction={transaction} />
					</div>
				)
			})}
		</>
	)
}

export default TransactionList

export const TransactionListLoader = () => {
	return (
		<div>
			{[0, 0, 0, 0, 0].map((_, i) => {
				return (
					<div
						className={`${'border-b-1 border-borderGray'}`}
						key={`loader__${i}`}
					>
						<TransactionLoader lastTransaction={false} />
					</div>
				)
			})}
		</div>
	)
}
