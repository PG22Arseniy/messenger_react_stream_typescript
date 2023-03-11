import { Outlet, useLocation } from "react-router-dom"
import { FullScreenCard } from "../../components/FullScreenCard"
import { CustomLink } from "../../components/CustomLink"

export const AuthLayout = () => {

    const location = useLocation()
    const isLoginPage = location.pathname === "/login"

    return (
       <FullScreenCard>
            <FullScreenCard.Body>
                <Outlet/>
            </FullScreenCard.Body>
            <FullScreenCard.BelowCard>
                <CustomLink to= {isLoginPage ? "/signup" : "/login"}>
                {isLoginPage ? "Create Account" : "Login"} 
                </CustomLink>
            </FullScreenCard.BelowCard>
       </FullScreenCard> 
    )
}