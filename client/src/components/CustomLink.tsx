import { DetailedHTMLProps, ButtonHTMLAttributes, forwardRef } from "react"
import "../styles/customLink.css"
import { LinkProps, Link } from "react-router-dom"

// passing a type of <Button>
export const CustomLink = ({className, children,  ...rest }:LinkProps) => {

    return(
        <Link
            className={`customLink ${className}`}
            {...rest} 
        >
            {children} 
        </Link> 
    )
}