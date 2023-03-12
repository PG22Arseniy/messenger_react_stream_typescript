import { Channel, ChannelHeader, ChannelList, ChannelListMessengerProps, Chat, LoadingIndicator, MessageInput, MessageList, Window, useChatContext } from "stream-chat-react"
import { useAuth, useLoggedInAuth } from "../context/AuthContext"
import "../styles/Messenger.css" 
import { CustomButton } from "../components/CustomButton"
import { useNavigate } from "react-router-dom"

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
    </Chat>
}


const Channels = ({loadedChannels}: ChannelListMessengerProps) => {

    const {setActiveChannel, channel: activeChannel} = useChatContext()
    const navigate = useNavigate();
    const {logout} = useLoggedInAuth()


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

                    </CustomButton>
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