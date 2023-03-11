import { FormEvent, useRef } from "react"
import { CustomButton } from "../components/CustomButton"
import { CustomInput } from "../components/CustomInput"
import "../styles/FullScreenCard.css"
import { useAuth } from "../context/AuthContext"

export const Signup = () => {


    const {signup} = useAuth()


    //refs to input values

    const usernameRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const urlRef = useRef<HTMLInputElement>(null)   

    // functions
    const handleSubmit = (e: FormEvent)=> {
        e.preventDefault(); // no refresh

        if (signup.isLoading) return

        // get refs for user
        const username = usernameRef.current?.value
        const name = nameRef.current?.value
        const url = urlRef.current?.value

        // null or empty check
        if (name == null || username == null || name === "" || username === "") return

        // call signup
        signup.mutate({id: username, name: name, url: url})
    }

    return (
        <div>
           <h1 className="cardTitle"> Sign Up </h1>
           <form onSubmit={handleSubmit} className="cardForm">
                <div className="inputRow">
                    <label htmlFor="username">Username</label>
                    <CustomInput id="username" required pattern="\S*" ref={usernameRef}/> 
                </div>
                <div className="inputRow">
                    <label htmlFor="name">Name</label>
                    <CustomInput id="name" required ref={nameRef}/> 
                </div>
                <div className="inputRow">
                    <label htmlFor="url">Image URL</label>
                    <CustomInput  id="url" type="url" ref = {urlRef}/>
                </div>

                <CustomButton disabled = {signup.isLoading} type = "submit"> Sign Up </CustomButton>
           </form> 
        </div>  
    )
} 