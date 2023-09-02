import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { TransactionsProvider } from '../services/transactions'
import { SessionProvider } from '../services/session'

function PatagoniaDashboard({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider>
			<TransactionsProvider>
				<Component {...pageProps} />
			</TransactionsProvider>
		</SessionProvider>
	)
}

export default PatagoniaDashboard
