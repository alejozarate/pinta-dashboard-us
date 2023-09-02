import { Chart as ChartJS, registerables } from 'chart.js'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { PNT_DECIMALS } from '../constants'
import { useSession } from '../services/session'
import Input from './input'
import Card from './card'
ChartJS.register(...registerables)

interface searchFromTo {
	day: string
	amount: number
}

interface dataChart {
	labels: string[]
	datasets: {
		label: string
		data: number[]
		backgroundColor: string[]
		borderColor: string[]
		borderWidth: number
	}[]
}

const PrintChart = () => {
	const { JWT, address } = useSession()
	const [pntUsage, setPntUsage] = useState<searchFromTo[]>(() => [])
	const [to, setTo] = useState<Date>(new Date())
	const [from, setFrom] = useState<Date>(
		new Date(to.getFullYear(), to.getMonth(), to.getDate() - 7)
	)

	const [dataChart, setDataChart] = useState<dataChart>({
		labels: pntUsage.map((e) => e.day),
		datasets: [
			{
				label: 'Cantidad de Pintas',
				data: pntUsage.map((e) => e.amount),
				backgroundColor: ['#52E0BE'],
				borderColor: ['#15BB93'],
				borderWidth: 1,
			},
		],
	})

	const refreshGraph = async () => {
		if (!JWT || !address) return

		fetch(
			`/api/searchFromTo?from=${Math.floor(
				from.getTime()
			)}&to=${Math.floor(to.getTime())}`,
			{
				headers: {
					Authorization: `Bearer ${JWT}`,
				},
			}
		)
			.then((_e) => _e.json())
			.then((_body) => {
				console.log(_body)
				setPntUsage(_body)
			})
			.catch((e) => console.error(e))
	}

	useEffect(() => {
		refreshGraph()
	}, [to, from])

	useEffect(() => {
		setDataChart((_dataChart) => {
			return {
				labels: pntUsage.map((e) => e.day),
				datasets: [
					{
						label: _dataChart.datasets[0].label,
						data: pntUsage.map((e) =>
							parseFloat(
								ethers.utils.formatUnits(e.amount, PNT_DECIMALS)
							)
						),
						backgroundColor: _dataChart.datasets[0].backgroundColor,
						borderColor: _dataChart.datasets[0].borderColor,
						borderWidth: _dataChart.datasets[0].borderWidth,
					},
				],
			}
		})
	}, [pntUsage])

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

	return (
		<div>
			<div className="flex justify-between text-center mb-4">
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
			<Card className="py-4 px-2">
				<Bar
					data={dataChart}
					width="auto"
					height="auto"
					options={{
						maintainAspectRatio: true,
						scales: {
							y: {
								ticks: {
									precision: 0,
								},
							},
						},
					}}
				/>
			</Card>
		</div>
	)
}

export default PrintChart
