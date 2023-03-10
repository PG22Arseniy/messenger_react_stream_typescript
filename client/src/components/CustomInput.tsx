import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react"
import "../styles/customInput.css"

export const CustomInput = forwardRef<HTMLInputElement,
DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, 
HTMLInputElement>>(
    ({className, ...rest }, ref) => {

    return(
        <input
            title="input"
            className={`customInput ${className}`}
            {...rest} 
            ref = {ref}
        />
    )
})