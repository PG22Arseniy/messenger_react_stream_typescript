import { UseMutationResult, useMutation } from "@tanstack/react-query"
import axios, { AxiosResponse } from "axios"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { StreamChat } from "stream-chat"

type AuthContext = {
    signup: UseMutationResult<AxiosResponse, unknown, User>
    login: UseMutationResult<{token: string, user: User}, unknown, string>
    user?: User
    streamChat?: StreamChat
}

type User = {
    id: string
    name: string
    url?: string
} 
const Context = createContext<AuthContext | null>(null)

export const useAuth = () => {
    return useContext(Context) as AuthContext 
}


type AuthProviderProps = {
    children: ReactNode
}

export  const AuthProvider = ({children}: AuthProviderProps) => {   


    // states
    const [user, setUser] = useState<User>()
    const [token, setToken] = useState<string>()
    const [streamChat, setStreamChat] = useState<StreamChat>()

    // react navigation
    const navigate = useNavigate();

    const signup = useMutation({
        mutationFn: (user: User)=>{
            return axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, user)
        },
        onSuccess (){
            navigate("/login");
        }
    })

    const login = useMutation({
        mutationFn: (id: string)=>{
            return axios.post(`${import.meta.env.VITE_SERVER_URL}/login`, {id}) 
                .then(res => {
                   return res.data as {token: string, user: User} 
                })
        },
        onSuccess(data){
            setUser(data.user)
            setToken(data.token)
        }
    })


    useEffect(()=>{
        // null check
        if (token == null || user == null) return

        // new chat app
        const chat = new StreamChat(import.meta.env.VITE_STREAM_API_KEY)

        //check if alreay logged in
        if (chat.tokenManager.token === token && chat.userID === user.id) return

        // try connecting user to the chat
        let isInterrupted = false
        const ConnectPromise = chat.connectUser(user, token).then (()=>{
            if (isInterrupted) return

            setStreamChat(chat)

            // chat reset and current user disconnect
            return ()=> {
                isInterrupted = true
                setStreamChat(undefined)

                ConnectPromise.then(()=>{
                    chat.disconnectUser(); 
                })
            }
        })
    }, [user, token])

    return <Context.Provider value={{signup, login, user, streamChat}}>  
        {children} 
    </Context.Provider>
}