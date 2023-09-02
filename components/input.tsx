import { HTMLInputTypeAttribute } from 'react'
import Label from './label'

interface IInput {
	label?: string
	placeholder: string
	onChange: Function
	value: any
	type: HTMLInputTypeAttribute
	className?: string
	min?: string
}

const Input = ({
	label,
	placeholder,
	onChange,
	value,
	type,
	className,
	min,
}: IInput) => {
	return (
		<div className="flex flex-col gap-3 ">
			<Label className="font-bold">{label}</Label>
			<input
				placeholder={placeholder}
				onChange={(e) => onChange(e)}
				value={value}
				type={type}
				min={min || ''}
				className={`border-[2px] border-divider focus:border-[#15BB93] outline-none p-4 rounded-4 focus:bg-white ${className} `}
			/>
		</div>
	)
}

export default Input
