import Label from './label'
import { Home, Activity, Logout, User } from './icons'

const ICONS = {
	home: <Home />,
	activity: <Activity />,
	logout: <Logout />,
	user: <User />,
}

interface ISidebarLink {
	className?: string
	label?: string
	icon?: keyof typeof ICONS
	active?: boolean
}

const SidebarLink = ({
	className,
	label,
	icon,
	active = false,
}: ISidebarLink) => {
	return (
		<div
			className={`flex gap-3 px-6 py-4 items-center rounded-4 cursor-pointer  transition-all  ${
				active
					? 'bg-primary text-white'
					: 'text-grayText hover:text-grayText hover:bg-offWhite'
			}`}
		>
			<span className={`${active ? 'text-white' : 'text-grayIcons'}`}>
				{icon && ICONS[icon]}
			</span>
			<Label className="font-bold">{label}</Label>
		</div>
	)
}

export default SidebarLink
