import { FormEvent, useRef } from "react"
import { CustomButton } from "../components/CustomButton"
import { CustomInput } from "../components/CustomInput"
import "../styles/FullScreenCard.css"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

export const Login = () => {


    const {login, user} = useAuth()

    if (user != null) {
        return <Navigate to = "/"/>
    }

    //refs to input values

    const usernameRef = useRef<HTMLInputElement>(null) 

    // functions
    const handleSubmit = (e: FormEvent)=> {
        e.preventDefault(); // no refresh

        if (login.isLoading) return

        // get refs for user
        const username = usernameRef.current?.value


        // null or empty check
        if (username == null || username === "") return

        // call login
        login.mutate(username)
    }

    return (
        <div>
           <h1 className="cardTitle"> Login </h1>
           <form onSubmit={handleSubmit} className="cardForm">
                <div className="inputRow">
                    <label htmlFor="username">Username</label>
                    <CustomInput id="username" required pattern="\S*" ref={usernameRef}/> 
                </div>

                <CustomButton disabled = {login.isLoading} type = "submit"> Login </CustomButton>
           </form> 
        </div>  
    )
} 