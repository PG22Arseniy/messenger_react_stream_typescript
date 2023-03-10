import "../styles/FullScreenCard.css"
import {ReactNode} from 'react'

type FullScreenCardProps = {
    children: ReactNode;
}

export const FullScreenCard = ({children}: FullScreenCardProps)=> {

    return (
        <div className="cardWrapper">
            <div className="cardContent">
                {children}  
            </div>
        </div>
    )
}