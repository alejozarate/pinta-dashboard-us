import { ethers } from 'ethers'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Card from '../../components/card'
import RankingIcon from '../../components/icons/ranking'
import Input from '../../components/input'
import Layout from '../../components/layout'
import { ENS } from '@ensdomains/ensjs'
import { PNT_DECIMALS } from '../../constants'
import { useSession } from '../../services/session'

interface User {
	total: string
	address: string
}

const Ranking: NextPage = () => {
	const { JWT, address } = useSession()
	const [to, setTo] = useState<Date>(new Date())
	const [from, setFrom] = useState<Date>(
		new Date(to.getFullYear(), to.getMonth(), to.getDate() - 7)
	)

	const [addressName, setAddressName] = useState<any>({})

	const [ensInstance, setEnsInstance] = useState<any>(undefined)
	const [lastFetchedResult, setLastFetchedResult] = useState<string>('')

	useEffect(() => {}, [lastFetchedResult])

	const [loading, setLoading] = useState<boolean>(false)
	const [top20, setTop20] = useState<User[]>([])

	const refreshGraph = async () => {
		if (loading || !JWT || !address) return

		setLoading(true)

		fetch(`/api/getRanking?from=${from.getTime()}&to=${to.getTime()}`, {
			headers: {
				Authorization: `Bearer ${JWT}`,
			},
		})
			.then((_e) => _e.json())
			.then((_body) => {
				setTop20(_body)
			})
			.catch((e) => {
				console.error(e)
				setLoading(false)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const setDateBefore = (date: string): Date => {
		const d = new Date(date)
		return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
	}

	const verifyDate = (date: string): Date | false => {
		try {
			const d = setDateBefore(date)

			d.toISOString() //esto verifica si es objeto date es un objeto valido, sino arroja al catch
			return d
		} catch (e) {
			return false
		}
	}

	const dateToInputValue = (date: Date): string | false => {
		try {
			return date.toISOString().slice(0, 10)
		} catch (error) {
			return false
		}
	}

	const providerUrl = `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
	useEffect(() => {
		if (ensInstance) return

		const init = async () => {
			try {
				const provider = new ethers.providers.JsonRpcProvider(
					providerUrl
				)

				const ENSInstance = new ENS()
				await ENSInstance.setProvider(provider)
				setEnsInstance(ENSInstance)
			} catch (error) {
				console.log('Failed to set ensInstance', error)
			}
		}
		init()
	}, [])

	useEffect(() => {
		refreshGraph()
	}, [to, from])

	return (
		<Layout>
			<div className="max-w-[1200px] mx-auto">
				<div className="flex justify-between mb-4 text-center">
					<Input
						type="date"
						onChange={(e: any) => {
							if (verifyDate(e.target.value)) {
								setFrom(setDateBefore(e.target.value))
							}
						}}
						placeholder=""
						value={dateToInputValue(from)}
						className="bg-white"
					></Input>
					<Input
						type="date"
						onChange={(e: any) => {
							if (verifyDate(e.target.value)) {
								setTo(setDateBefore(e.target.value))
							}
						}}
						placeholder=""
						value={dateToInputValue(to)}
						className="bg-white"
					></Input>
				</div>
				{loading ? (
					<div className="relative z-0 flex flex-col items-center justify-center mt-12">
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
						<div className="font-bold">Loading</div>
					</div>
				) : (
					<Card>
						<div className="flex gap-3 p-6 border-b border-borderGray">
							<div className="text-grayIcons">
								<RankingIcon />
							</div>
							<div className="font-bold text-primary">Top 20</div>
						</div>
						<div className="">
							{top20.length === 0 && (
								<div className="items-center justify-center p-6 text-center">
									No results in selected period
								</div>
							)}
							{top20 &&
								top20.map &&
								top20.map((user, i) => {
									const lastUser = i === top20.length - 1
									const amount = parseFloat(
										ethers.utils.formatUnits(
											user.total,
											PNT_DECIMALS
										)
									)

									const shortenAddress = `${user.address.substring(
										0,
										2
									)}...${user.address.substring(
										user.address.length - 7
									)}`

									if (
										ensInstance &&
										!addressName[user.address]
									) {
										ensInstance
											.getName(user.address)
											.then((result: any) => {
												const _result =
													result && result.name
														? result.name
														: shortenAddress
												setLastFetchedResult(_result)
												// setAddressName
												setAddressName((_prev: any) => {
													return {
														..._prev,
														[user.address]: _result,
													}
												})
											})
									}

									return (
										<div
											key={`${user.address}_${i}`}
											className={`flex items-center justify-between p-6 ${
												lastUser
													? ''
													: 'border-b-1 border-borderGray'
											}`}
										>
											<div className="flex items-center gap-6">
												<div>{i + 1}</div>
												<div>
													{addressName[
														user.address
													] || shortenAddress}
												</div>
											</div>
											<div>
												{amount}{' '}
												{amount == 1
													? 'Pinta'
													: 'Pintas'}
											</div>
										</div>
									)
								})}
						</div>
					</Card>
				)}
			</div>
		</Layout>
	)
}

export default Ranking
