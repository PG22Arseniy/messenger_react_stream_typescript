import { useLoggedInAuth } from "../context/AuthContext"
import { LoadingIndicator } from "stream-chat-react"
import { FormEvent, useRef, useState } from "react"
import { CustomInput } from "../components/CustomInput"
import { CustomButton } from "../components/CustomButton"
import "../styles/FullScreenCard.css" 
import { FullScreenCard } from "../components/FullScreenCard"
import { CustomLink } from "../components/CustomLink"
import Select, { SelectInstance } from "react-select"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"


export const NewChannel = () => {
  

    // react navigation
    const navigate = useNavigate();
    
    const {user, streamChat} = useLoggedInAuth()

    //refs to input values
    const nameRef = useRef<HTMLInputElement>(null)
    const urlRef = useRef<HTMLInputElement>(null) 
    const membersRef = useRef<SelectInstance<{label:string, value:string}>>(null) 

    type ChannelProps = {
        name:string
        memberIds: string[]
        url?:string
    } 

    const createChannel = useMutation({
        mutationFn: ({name, memberIds, url }: ChannelProps)=> {
            
            // check if there is no chat
            if (streamChat == null) throw Error ("Not Connected")

            // create messaging chat with inputed data 
            return streamChat.channel(
                "messaging", // messaging - type of channel
                crypto.randomUUID(), // channel ID
                {name, image: url, members: [user.id, ...memberIds]} // channel data
                ).create()
        },
        onSuccess (){
            navigate("/") 
        }  
    })


    const handleSubmit = (e: FormEvent)=> {
        e.preventDefault(); // no refresh

        const name = nameRef.current?.value
        const url = urlRef.current?.value
        const members = membersRef.current?.getValue()

        // null or empty check
        if (name == null  || name === "" || members == null || members.length === 0) return

        createChannel.mutate({
            name, url, memberIds: members.map(member => member.value)
        })
    }


    if (streamChat == null) return <LoadingIndicator/>  
  

    const users = useQuery({
        queryKey: ["stream", "users"],
        queryFn: () =>
          streamChat!.queryUsers({ id: { $ne: user.id } }, { name: 1 }),
        enabled: streamChat != null,
      })

    return (
 
    <FullScreenCard> 
        <FullScreenCard.Body>
            <h1 className="cardTitle"> Create New Channel </h1> 
            <form onSubmit={handleSubmit} className="cardForm">
                <div className="inputRow">
                    <label htmlFor="username">Channel Name</label>
                    <CustomInput id="username" required pattern="\S*" ref={nameRef}/> 
                </div>
                <div className="inputRow"> 
                    <label htmlFor="url"> Image URL</label> 
                    <CustomInput  id="url" type="url" ref = {urlRef}/>
                </div> 

                <div className="inputRow"> 
                    <label htmlFor="members"> Members </label>  
                    <Select 
                        ref = {membersRef} 
                        id = "members" 
                        required
                        isMulti
                        classNames={{container: () => "selectConatiner"}}
                
                        options={users.data?.users.map(user => {
                            return { value: user.id, label: user.name || user.id }
                        })} 
                    /> 
                    
                </div> 

                <CustomButton  
                    type = "submit"
                    disabled = {createChannel.isLoading}> 
                    New Channel 
                </CustomButton>
            </form>  
        </FullScreenCard.Body> 
        <FullScreenCard.BelowCard>
            <CustomLink to= "/">
                Back 
            </CustomLink> 
        </FullScreenCard.BelowCard> 
    </FullScreenCard>  

    )
}
