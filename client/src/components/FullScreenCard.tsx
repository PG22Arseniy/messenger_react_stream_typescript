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

FullScreenCard.Body = function ({children}: FullScreenCardProps){
    return (
        <div className="cardBody"> 
            {children}
        </div>
    )
}

FullScreenCard.BelowCard = function ({children}: FullScreenCardProps){
    return (
        <div className="cardBelow"> 
            {children}
        </div>
    )
}