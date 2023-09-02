import { MouseEventHandler, ReactNode } from 'react'

interface IButton {
	loading?: boolean
	className?: string
	children: ReactNode
	onClick?: MouseEventHandler<HTMLDivElement>
}

const Button = ({ loading, children, onClick, className }: IButton) => {
	return (
		<div
			className={`cursor-pointer text-center py-4 px-12 transition-all opacity-50 hover:opacity-100 rounded-4 ${
				loading ? 'opacity-50 cursor-none pointer-events-none' : ''
			} ${className}`}
			onClick={onClick}
		>
			{children}
		</div>
	)
}

export default Button
