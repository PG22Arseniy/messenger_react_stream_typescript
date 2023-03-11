import { DetailedHTMLProps, ButtonHTMLAttributes, forwardRef } from "react"
import "../styles/customButton.css"

// passing a type of <Button>
export const CustomButton = forwardRef<HTMLButtonElement,
DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, 
HTMLButtonElement>>(
    ({className, children,  ...rest }, ref) => {

    return(
        <button
            className={`customButton ${className}`}
            {...rest} 
            ref = {ref} 
        >
            {children} 
        </button> 
    )
})