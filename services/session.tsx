import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

import jwt_decode from 'jwt-decode'

import { useRouter } from 'next/router'

export interface ISessionContext {
	JWT: string | false
	setJWT: Function
	address: string | false
	setAddress: Function
	logout: Function
	isAdmin: boolean
	label: string
	quantity: string
}

export const SessionContext = createContext<ISessionContext>({
	isAdmin: false,
	JWT: false,
	setJWT: () => {},
	address: false,
	label: '',
	quantity: '',
	setAddress: () => {},
	logout: () => {},
})

export function useSession() {
	return useContext(SessionContext)
}

interface ISessionProps {
	children: ReactNode
}

const SESSION_JWT_KEY = 'session'
const ADDRESS_KEY = 'address'

interface IDecodedJWT {
	address: string
	label: string
	quantity: string
	exp: number
	iat: number
	iss: string
	nbf: number
}

export const SessionProvider = ({ children }: ISessionProps) => {
	const router = useRouter()

	const [JWT, _setJWT] = useState<ISessionContext['JWT']>(false)
	const [address, _setAddress] = useState<ISessionContext['address']>(false)
	const [label, setLabel] = useState<string>('')
	const [quantity, setQuantity] = useState<string>('')
	const [isAdmin, setIsAdmin] = useState<boolean>(false)

	useEffect(() => {
		const _adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS
		if (!JWT || !_adminAddress) return

		try {
			const _jwt: IDecodedJWT = jwt_decode(JWT)
			if (_jwt) {
				if (_jwt['address']) {
					setIsAdmin(
						_adminAddress.toLowerCase() ===
							_jwt['address'].toLowerCase()
					)
				}
				if (_jwt['label']) {
					setLabel(_jwt['label'])
				}
				if (_jwt['quantity']) {
					setQuantity(_jwt['quantity'])
				}
			}
		} catch (e) {
			console.log('Error decoding JWT', e)
		}
	}, [JWT])

	const setJWT = (_jwt: ISessionContext['JWT']) => {
		if (_jwt) {
			localStorage.setItem(SESSION_JWT_KEY, _jwt)
			_setJWT(_jwt)
		}
	}

	const setAddress = (_address: ISessionContext['address']) => {
		if (_address) {
			localStorage.setItem(ADDRESS_KEY, _address)
			_setAddress(_address)
		}
	}

	useEffect(() => {
		const _jwt = JWT || localStorage.getItem(SESSION_JWT_KEY)

		if (!_jwt) {
			localStorage.setItem(SESSION_JWT_KEY, '')
			_setJWT(false)
			router.push('/')
		}
		fetch(`/api/authenticate`, {
			headers: {
				Authorization: `Bearer ${_jwt}`,
			},
		})
			.then(async (res) => {
				const data = await res.json()
				if (data.status !== 'OK') {
					setJWT(false)
					localStorage.setItem(SESSION_JWT_KEY, '')
					return router.push('/')
				}
			})
			.catch((e) => {
				setJWT(false)
				localStorage.setItem(SESSION_JWT_KEY, '')
				router.push('/')
			})

		const _address = localStorage.getItem(ADDRESS_KEY)

		if (_jwt && _address) {
			_setJWT(_jwt)
			_setAddress(_address)
		} else {
			router.push('/')
		}
	}, [router.pathname, JWT, address])

	const logout = () => {
		localStorage.removeItem(SESSION_JWT_KEY)
		localStorage.removeItem(ADDRESS_KEY)
		_setJWT(false)
		_setAddress(false)
		router.push('/')
	}

	const sessionContextProvider = {
		label,
		quantity,
		isAdmin,
		JWT,
		setJWT,
		address,
		setAddress,
		logout,
	}

	return (
		<SessionContext.Provider value={sessionContextProvider}>
			{children}
		</SessionContext.Provider>
	)
}
