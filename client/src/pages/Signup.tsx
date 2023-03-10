import { CustomInput } from "../components/CustomInput"
import "../styles/FullScreenCard.css"

export const Signup = () => {
    return (
        <div>
           <h1 className="cardTitle"> Sign Up </h1>
           <form className="cardForm">
                <div className="inputRow">
                    <label htmlFor="username">Username</label>
                    <CustomInput id="username"/>
                </div>
                <div className="inputRow">
                    <label htmlFor="name">Name</label>
                    <CustomInput id="name"/>
                </div>
                <div className="inputRow">
                    <label htmlFor="url">Image URL</label>
                    <CustomInput  id="url" type="url"/>
                </div>
           </form>
        </div>  
    )
}