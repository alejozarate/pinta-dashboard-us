import { ReactNode } from 'react'

interface ICard {
	children?: ReactNode
	className?: string
}

const Card = ({ children, className }: ICard) => {
	return (
		<div
			className={`bg-white rounded-4 border border-borderGray overflow-hidden ${className}`}
			style={{
				boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
			}}
		>
			{children}
		</div>
	)
}

export default Card
