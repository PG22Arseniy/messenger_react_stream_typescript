import { Channel, ChannelHeader, ChannelList, ChannelListMessengerProps, Chat, LoadingIndicator, MessageInput, MessageList, Window, useChatContext } from "stream-chat-react"
import { useLoggedInAuth } from "../context/AuthContext"
import "../styles/Messenger.css" 
import "../styles/FullScreenCard.css"  
import { CustomButton } from "../components/CustomButton"
import { useNavigate } from "react-router-dom"
import { FullScreenCard } from "../components/FullScreenCard"
import Select, { SelectInstance } from "react-select"
import { FormEvent, useRef } from "react"
import { CustomInput } from "../components/CustomInput"
import { useQuery } from "@tanstack/react-query"

export const Home = () => { 

    const {user, streamChat} = useLoggedInAuth()

    if (streamChat == null) return <LoadingIndicator/> 

    return <Chat client={streamChat}> 
        <ChannelList List={Channels} sendChannelsToList filters={{members: {$in: [user.id]}}}/>
        <Channel>
            <Window>
                <ChannelHeader/> 
                <MessageList/> 
                <MessageInput/>
            </Window>
        </Channel>
        <EditChannelForm/>  
    </Chat>
}


const Channels = ({loadedChannels}: ChannelListMessengerProps) => {

    const {user} = useLoggedInAuth()

    const {setActiveChannel, channel: activeChannel} = useChatContext()
    const navigate = useNavigate();
    const {logout} = useLoggedInAuth() 

    const openEdit = () => { 
        // show the edit from
        document.getElementById("editSection")?.classList.remove("hidden");
    }

    return (
    <div className="channelsSection">
        <CustomButton onClick={()=> navigate("channel/new")}>New Conversation</CustomButton>
        <hr/>

        {
         loadedChannels!= null && loadedChannels.length > 0 ?
            loadedChannels.map (channel => {
                const isActive = channel === activeChannel
                const activityClass = isActive ? "activeChannel" : "nonActiveChannel"

                return (
                    <div className="channelContainer"> 
                        <CustomButton 
                            onClick={()=> setActiveChannel(channel)} 
                            disabled = {isActive}   
                            className={`channelButton ${activityClass}`}  
                            key={channel.id}>
                            
                            {
                                channel.data?.image && (
                                    <img 
                                        src = {channel.data.image}
                                        className="channelImg"
                                        title="image" 
                                    />
                                )
                            }

                            <div className="channelName">
                                {channel.data?.name || channel.id}
                            </div>

                        <div><a className="deleteIcon" onClick={()=> {
                            channel?.removeMembers ([user.id])  
                            }}> x </a> </div>   

                        </CustomButton>

                        {
                            // Edit Button appears only on selected (active) chats
                            activeChannel==channel ? 
                            <CustomButton className="editButton" onClick={openEdit}> Edit </CustomButton> 
                            : <> </> 
                        }  
                    </div>
                )
            })
            : "No conversations"
        }
        <hr/>
        <CustomButton 
        disabled = {logout.isLoading} 
        onClick={()=> logout.mutate()}> 
            Logout 
        </CustomButton>
        
    </div> 
    )
}


const EditChannelForm = () => {

    const {user, streamChat} = useLoggedInAuth()

    const {channel: activeChannel} = useChatContext()

      //refs to input values
      const nameRef = useRef<HTMLInputElement>(null)
      const urlRef = useRef<HTMLInputElement>(null) 
      const membersRef = useRef<SelectInstance<{label:string, value:string}>>(null) 

    const editChannel = (e: FormEvent)=>{
        e.preventDefault()  

        const name = nameRef.current?.value
        const url = urlRef.current?.value
        const members = membersRef.current?.getValue()
         

        // null or empty check
        if (name == null  || name === "" || members == null || members.length === 0) return
        
        activeChannel?.update( 
            {
                name: name,
                image: url,   
            }  
        );

          

        activeChannel?.queryMembers({}).then(channel=>{
            //remove users
            let UsersToDelete = channel.members.filter((user)=>{
                
                let match = false
                members.forEach(member => {
                    if (member.value === user.user_id) match=true     
                })

                return !match  
              }); 

            UsersToDelete.forEach(member=>{

                if (user.id === member.user_id) return 

                activeChannel.removeMembers ([member.user_id!])
            })


            //add users  
            let UsersToAdd = members.filter((member)=>{
    
                let match = false
                channel.members.forEach(user => {
                    if (member.value === user.user_id) match=true     
                })

                return !match  
                }); 

            UsersToAdd.forEach(member=>{

                if (user.id === member.value) return

                activeChannel.addMembers([member.value]) 
            }) 
             
        })

        closeEdit() 
        
    }

    const users = useQuery({
        queryKey: ["stream", "users"],
        queryFn: () =>
          streamChat!.queryUsers({ id: { $ne: user.id } }, { name: 1 }),
        enabled: streamChat != null,
      }) 


    const closeEdit = () => {

        document.getElementById("editSection")?.classList.add("hidden"); 
    }

    return(
        <div id = "editSection" className="editChannelWrapper hidden">    
             <FullScreenCard >
                <FullScreenCard.Body>
                    <h1 className="cardTitle"> Edit Channel </h1> 
                    <form onSubmit={editChannel} className="cardForm">
                        <div className="inputRow">
                            <label htmlFor="channelName">Channel Name</label>
                            <CustomInput id="channelName" required pattern="\S*" ref={nameRef}/>    
                        </div>
                        <div className="inputRow"> 
                            <label htmlFor="channelUrl"> Image URL</label> 
                            <CustomInput  id="channelUrl" type="url" ref = {urlRef} />  
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

                        <CustomButton type = "submit"> 
                            Save Changes 
                        </CustomButton>

                        <div><a className="closeIcon" onClick={closeEdit}> x </a> </div>  
                    </form>  
                </FullScreenCard.Body> 
            </FullScreenCard> 
        </div>
    )
}