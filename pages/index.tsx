import { NextPage } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Input from '../components/input'
import { useSession } from '../services/session'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
	const router = useRouter()
	const { setJWT, setAddress, JWT, address } = useSession()

	useEffect(() => {
		if (!JWT || !address) return

		router.push('/user')
	}, [JWT, address])

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [error, setError] = useState('')

	const validEmail = () => {
		return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
	}

	const validPassword = () => {
		return password.length > 4
	}

	const validCredentials = () => {
		return validEmail() && validPassword()
	}

	useEffect(() => {
		setError('')
	}, [email, password])

	const login = () => {
		if (!validCredentials()) return

		fetch(`/api/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
			.then(async (response) => {
				const data = await response.json()
				if (data.jwt && data.address) {
					setJWT(data.jwt)
					setAddress(data.address)
					router.push('/user')
				} else {
					setError('Alguno de los datos ingresados es incorrecto')
				}
			})
			.catch((e) => {
				setError('Alguno de los datos ingresados es incorrecto')
				console.log(e)
			})
	}
	return (
		<div className="flex items-center justify-center h-screen">
			<div
				className="bg-white rounded-8 border border-borderGray w-full max-w-[480px] mx-4 p-12 mobile:p-8 flex flex-col gap-14"
				style={{
					boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
				}}
			>
				<div className="text-center">
					<Image
						src="/logos/pinta-home.png"
						width={300}
						height={70}
					/>
				</div>
				<div className="flex flex-col gap-10">
					<div>
						{error && (
							<div className="text-red-600 mb-6">{error}</div>
						)}
						<Input
							label="Email"
							placeholder="pinta@email.com"
							type="email"
							onChange={(e: any) => {
								setEmail(e.target.value)
							}}
							value={email}
							className="bg-[#F5F6FA]"
						/>
					</div>
					<div>
						<Input
							label="Contraseña"
							placeholder="Ingrese su contraseña"
							type={'password'}
							onChange={(e: any) => {
								setPassword(e.target.value)
							}}
							value={password}
							className="bg-[#F5F6FA]"
						/>
					</div>
				</div>
				<div>
					<div
						className={` text-white text-center p-4 transition-all rounded-4 bg-[#034030] ${
							validCredentials()
								? 'cursor-pointer hover:bg-[#022E23]'
								: 'opacity-50 cursor-none pointer-events-none'
						}`}
						onClick={() => login()}
					>
						Ingresar
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
