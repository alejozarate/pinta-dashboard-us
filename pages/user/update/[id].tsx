import { NextPage } from 'next'
import router from 'next/router'
import { useEffect, useState } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import Card from '../../../components/card'
import { ImageIcon } from '../../../components/icons'
import RankingIcon from '../../../components/icons/ranking'
import Input from '../../../components/input'
import Label from '../../../components/label'
import Layout from '../../../components/layout'
import { useSession } from '../../../services/session'
import { IUser } from '../manage'

const Update: NextPage = (props: any) => {
	const { JWT, isAdmin } = useSession()

	const [label, setLabel] = useState<string>(props.label)
	const [email, setEmail] = useState<string>(props.email)
	const [password, setPassword] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')
	const [userAddress, setUserAddress] = useState<string>(props.address)
	const [quantity, setQuantity] = useState<number>(props.quantity)

	const [status, setStatus] = useState<'OK' | 'error' | 'pending'>('pending')

	const [images, setImages] = useState<ImageListType>([])
	const MAX_IMAGES_NUMBER = 1

	const onChangeImage = (imageList: ImageListType) => {
		console.log(imageList)
		setImages(imageList)
	}

	const [loading, setLoading] = useState<boolean>(false)

	const validFormData = () => {
		const validLabel = label && label.length > 3
		const validEmail =
			email &&
			email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
		const validPassword = password ? password && password.length > 4 : true
		const validConfirmPassword = password
			? password === confirmPassword
			: true
		const validUserAddress =
			userAddress && userAddress.match(/^0x[a-fA-F0-9]{40}$/g)

		return (
			validLabel &&
			validEmail &&
			validPassword &&
			validConfirmPassword &&
			validUserAddress
		)
	}

	const updateUser = () => {
		const image = images[0]
		if (!email || !label || !userAddress || !validFormData()) return

		const formData = new FormData()

		formData.set('id', props.id)
		formData.set('email', email)
		if (password) {
			formData.set('password', password)
		}
		formData.set('label', label)
		formData.set('address', userAddress)
		if (image && image['file'])
			formData.set('image', image['file'], image['file']['name'])

		setLoading(true)

		fetch(`/api/updateUser`, {
			method: 'POST',
			body: JSON.stringify({
				id: props.id,
				email,
				password: password ? password : '',
				label,
				address: userAddress,
				quantity,
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

	useEffect(() => {
		if (isAdmin) return

		router.push('/user')
	}, [isAdmin])

	return (
		<Layout>
			<div className="flex gap-3 mobile:gap-6 laptop:flex-col-reverse max-w-[1200px] mx-auto">
				<div className="flex flex-col gap-3 flex-3">
					<Card>
						<div className="flex gap-3 p-6 border-b border-borderGray">
							<div className="text-grayIcons">
								<RankingIcon />
							</div>
							<div className="font-bold text-primary">
								Update user
							</div>
						</div>
						<div className="flex mobile:flex-col gap-20 mobile:gap-0 p-6">
							<div className="flex flex-1 flex-col gap-6">
								<div>
									<Input
										label="Dashboard name"
										placeholder="Enter the name"
										type={'text'}
										onChange={(e: any) => {
											setLabel(e.target.value)
										}}
										value={label}
										className="bg-[#F5F6FA]"
									/>
								</div>
								<div>
									<Input
										label="User email"
										placeholder="Enter the email"
										type={'email'}
										onChange={(e: any) => {
											setEmail(e.target.value)
										}}
										value={email}
										className="bg-[#F5F6FA]"
									/>
								</div>
								<div>
									<Input
										label="Change password"
										placeholder="Enter the password"
										type={'text'}
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
										placeholder="Enter the password"
										type={'text'}
										onChange={(e: any) => {
											setConfirmPassword(e.target.value)
										}}
										value={confirmPassword}
										className="bg-[#F5F6FA]"
									/>
								</div>
							</div>
							<div className="flex flex-1 flex-col gap-6 mobile:mt-6">
								<div>
									<Input
										label="User address"
										placeholder="Enter the address"
										type={'text'}
										onChange={(e: any) => {
											setUserAddress(e.target.value)
										}}
										value={userAddress}
										className={`bg-[#F5F6FA] ${
											userAddress.match(
												/^0x[a-fA-F0-9]{40}$/g
											)
												? ''
												: userAddress
												? 'border border-red-500'
												: ''
										}`}
									/>
								</div>
								<div>
									<Input
										label="Amount of available PNT"
										placeholder="Amount of available PNT"
										type={'number'}
										min="0"
										onChange={(e: any) => {
											setQuantity(e.target.value)
										}}
										value={quantity}
										className={`bg-[#F5F6FA]`}
									/>
								</div>
								<div>
									<div className="mb-4 flex flex-col gap-1">
										<Label className="font-bold">
											Dashboard image
										</Label>
										<Label>
											<span className="text-sm text-grayText">
												Recommended 400x150px (.png)
											</span>
										</Label>
									</div>

									<ImageUploading
										acceptType={['png']}
										value={images}
										onChange={onChangeImage}
										maxNumber={MAX_IMAGES_NUMBER}
										dataURLKey="data_url"
									>
										{({
											imageList,
											onImageUpload,
											onImageRemoveAll,
											isDragging,
											dragProps,
										}) => (
											// write your building UI
											<div className="upload__image-wrapper">
												{imageList.length === 0 && (
													<div
														{...dragProps}
														className="rounded-4 border border-borderGray flex items-center justify-center min-h-[100px]"
													>
														<ImageIcon />
													</div>
												)}

												{imageList.map(
													(image, index) => (
														<div
															key={index}
															className="image-item"
														>
															<img
																src={
																	image[
																		'data_url'
																	]
																}
																alt=""
																className="w-full rounded-4 border border-borderGray overflow-hidden"
															/>
														</div>
													)
												)}
												<button
													className="rounded-4 border border-borderGray py-4 px-6 w-full text-center mt-4"
													style={
														isDragging
															? {
																	textDecoration:
																		'underline',
															  }
															: undefined
													}
													onClick={() => {
														imageList.length === 0
															? onImageUpload()
															: onImageRemoveAll()
													}}
													{...dragProps}
												>
													{imageList.length === 0
														? `Upload image`
														: `Remove`}
												</button>
											</div>
										)}
									</ImageUploading>
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
								onClick={() => updateUser()}
							>
								{status === 'OK'
									? 'User updated'
									: !loading
									? 'Update account'
									: 'Updating...'}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</Layout>
	)
}

export const getServerSideProps = (context: { query: IUser }) => {
	return {
		props: {
			...context.query,
		},
	}
}

export default Update
