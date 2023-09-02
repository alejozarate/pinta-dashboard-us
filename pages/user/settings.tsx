import { NextPage } from 'next'
import router from 'next/router'
import { useEffect, useState } from 'react'
import Card from '../../components/card'
import RankingIcon from '../../components/icons/ranking'
import Input from '../../components/input'
import Label from '../../components/label'
import Layout from '../../components/layout'
import { useSession } from '../../services/session'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { ImageIcon } from '../../components/icons'

const Settings: NextPage = () => {
	const { JWT, isAdmin } = useSession()

	const [password, setPassword] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')

	const [loading, setLoading] = useState<boolean>(false)
	const [status, setStatus] = useState<'OK' | 'error' | 'pending'>('pending')

	const validFormData = () => {
		const validPassword = password && password.length > 4
		const validConfirmPassword = password === confirmPassword

		return validPassword && validConfirmPassword
	}

	const updatePassword = () => {
		if (!password || !confirmPassword || !validFormData()) return

		setLoading(true)

		fetch(`/api/updatePassword`, {
			method: 'POST',
			body: JSON.stringify({
				password,
			}),
			headers: {
				Authorization: `Bearer ${JWT}`,
				'Content-Type': 'application/json',
			},
		})
			.then(async (response) => {
				const data = await response.json()
				setStatus(data.status)
			})
			.catch((e) => {
				console.log(e)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<Layout>
			<div className="flex gap-3 mobile:gap-6 laptop:flex-col-reverse max-w-[600px] mx-auto">
				<div className="flex flex-col gap-3 flex-3">
					<Card>
						<div className="flex gap-3 p-6 border-b border-borderGray">
							<div className="text-grayIcons">
								<RankingIcon />
							</div>
							<div className="font-bold text-primary">
								Modify password
							</div>
						</div>
						<div className="flex mobile:flex-col gap-20 mobile:gap-0 p-6">
							<div className="flex flex-1 flex-col gap-6">
								<div>
									<Input
										label="New password"
										placeholder="Enter the new password"
										type={'password'}
										onChange={(e: any) => {
											setPassword(e.target.value)
										}}
										value={password}
										className="bg-[#F5F6FA]"
									/>
								</div>
								<div>
									<Input
										label="Confirm password"
										placeholder="Confirm password"
										type={'password'}
										onChange={(e: any) => {
											setConfirmPassword(e.target.value)
										}}
										value={confirmPassword}
										className="bg-[#F5F6FA]"
									/>
								</div>
							</div>
						</div>
						<div className="flex-row-reverse flex gap-3 p-6 border-t border-borderGray">
							<div
								className={` text-white text-center py-4 px-12 transition-all rounded-4 bg-[#034030] ${
									validFormData()
										? 'cursor-pointer hover:bg-[#022E23]'
										: 'opacity-50 cursor-none pointer-events-none'
								} ${
									loading || status === 'OK'
										? 'opacity-50 cursor-none pointer-events-none'
										: ''
								}`}
								onClick={() => updatePassword()}
							>
								{status === 'OK'
									? 'Password updated'
									: !loading
									? 'Update password'
									: 'Updating...'}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</Layout>
	)
}

export default Settings
