import { UseMutationResult, useMutation } from "@tanstack/react-query"
import axios, { AxiosResponse } from "axios"
import { ReactNode, createContext, useContext } from "react"

type AuthContext = {
    signup: UseMutationResult<AxiosResponse, unknown, User>
    login: UseMutationResult<AxiosResponse, unknown, string>
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

    const signup = useMutation({
        mutationFn: (user: User)=>{
            return axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, user)
        }
    })

    const login = useMutation({
        mutationFn: (id: string)=>{
            return axios.post(`${import.meta.env.VITE_SERVER_URL}/login`, id)
        }
    })

    return <Context.Provider value={{signup, login}}> 
        {children} 
    </Context.Provider>
}