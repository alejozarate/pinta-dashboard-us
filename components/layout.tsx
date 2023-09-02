import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import { Menu, Refresh } from './icons'
import Label from './label'
import SidebarLink from './sidebar-link'
import { useRouter } from 'next/router'
import { useTransactions } from '../services/transactions'
import { useSession } from '../services/session'

const ROUTES_NAMES: Record<any, string> = {
	'/user': 'Inicio',
	'/user/activity': 'Actividad',
	'/user/ranking': 'Ranking',
	'/user/manage': 'Administración',
}

interface ISidebar {
	showMenu: boolean
	setShowMenu: Function
}

const Sidebar = ({ showMenu, setShowMenu }: ISidebar) => {
	const { logout, isAdmin, label, address } = useSession()
	const router = useRouter()

	useEffect(() => {}, [isAdmin, address])

	useEffect(() => {
		setShowMenu(false)
	}, [router.pathname])
	return (
		<div
			className={`py-6 px-4 w-[332px] mobile:w-full transition-all bg-white fixed ${
				showMenu ? 'mobile:left-0' : 'mobile:-left-full'
			} h-screen flex flex-col justify-between flex-grow-0 z-10 flex-shrink-0 basis-auto`}
			style={{
				boxShadow: '1px 0px 0px #DFE0EB',
			}}
		>
			<div>
				<header className="flex flex-col items-center justify-center gap-3 mobile:hidden">
					<Label className="font-bold">
						{label || 'Pinta dashboard'}
					</Label>
				</header>
				<div className="mt-32 mobile:mt-[120px] flex flex-col gap-2">
					<Link href={'/user'}>
						<div>
							<SidebarLink
								icon="home"
								label="Inicio"
								active={router.pathname === '/user'}
							/>
						</div>
					</Link>
					<Link href={'/user/activity'}>
						<div>
							<SidebarLink
								icon="activity"
								label="Actividad"
								active={router.pathname === '/user/activity'}
							/>
						</div>
					</Link>
					<Link href={'/user/ranking'}>
						<div>
							<SidebarLink
								icon="activity"
								label="Ranking"
								active={router.pathname === '/user/ranking'}
							/>
						</div>
					</Link>
					{isAdmin && (
						<Link href={'/user/manage'}>
							<div>
								<SidebarLink
									icon="user"
									label="Administración"
									active={router.pathname === '/user/manage'}
								/>
							</div>
						</Link>
					)}
					{!isAdmin && (
						<Link href={'/user/settings'}>
							<div>
								<SidebarLink
									icon="user"
									label="Configuración"
									active={
										router.pathname === '/user/settings'
									}
								/>
							</div>
						</Link>
					)}
					<div onClick={() => logout()}>
						<SidebarLink icon="logout" label="Cerrar sesión" />
					</div>
				</div>
			</div>
			<div className="flex -mt-[30px] items-center justify-center mb-4">
				<Image
					src={'/logos/pinta.png'}
					width="230"
					height="200"
					alt="Pinta Token"
				/>
			</div>
		</div>
	)
}

interface ILayout {
	children: ReactNode
}

const Layout = ({ children }: ILayout) => {
	const { label } = useSession()

	const [showMenu, setShowMenu] = useState<boolean>(false)
	const router = useRouter()
	const { refreshTransactions, loading } = useTransactions()
	return (
		<div className="flex">
			<Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />
			<main className="min-h-screen w-full ml-[332px] mobile:ml-0">
				<header className="flex items-center justify-between px-6 py-8 bg-white border-b-1 border-borderGray mobile:relative mobile:z-30">
					<div className="flex items-center gap-3">
						<div
							className="hidden mobile:block text-grayIcons"
							onClick={() => {
								setShowMenu((_prev) => !_prev)
							}}
						>
							<Menu />
						</div>
						<Label className="font-bold text-black mobile:hidden">
							{ROUTES_NAMES[router.pathname] || ''}
						</Label>
					</div>
					<div className="hidden mobile:block">
						<header className="flex flex-col items-center justify-center gap-3">
							<Label className="font-bold">
								{label || 'Pinta Dashboard'}
							</Label>
						</header>
					</div>
					<div>
						<div
							className="flex items-center gap-3 cursor-pointer"
							onClick={() => {
								refreshTransactions()
							}}
						>
							<div
								className={`${
									loading
										? 'animate-spin pointer-events-none cursor-none'
										: ''
								} inline`}
							>
								<Refresh />
							</div>
							<Label className="font-bold text-black mobile:hidden">
								Refrescar
							</Label>
						</div>
					</div>
				</header>
				<div className="w-full min-h-screen px-20 py-16 bg-grayBackground desktop:px-4 desktop:py-6">
					{children}
				</div>
			</main>
		</div>
	)
}

export default Layout
