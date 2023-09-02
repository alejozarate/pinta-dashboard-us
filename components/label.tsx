import { ReactNode } from "react"

interface ILabel {
    className?: string
    children: ReactNode
}

const Label = ({children, className}: ILabel) => {
    return <div className={`${className} tracking-normal leading-normal`}>{children}</div>
}

export default Label;