import { Outlet } from "react-router-dom"
import { FullScreenCard } from "../../components/FullScreenCard"

export const AuthLayout = () => {
    return (
       <FullScreenCard>
            <FullScreenCard.Body>
                <Outlet/>
            </FullScreenCard.Body>
            <FullScreenCard.BelowCard>
                BelowCard
            </FullScreenCard.BelowCard>
       </FullScreenCard> 
    )
}