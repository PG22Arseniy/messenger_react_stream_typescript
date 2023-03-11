import { Channel, ChannelHeader, ChannelList, ChannelListMessengerProps, Chat, LoadingIndicator, MessageInput, MessageList, Window, useChatContext } from "stream-chat-react"
import { useAuth, useLoggedInAuth } from "../context/AuthContext"
import "../styles/Messenger.css" 

export const Home = () => {

    const {user, streamChat} = useLoggedInAuth()

    if (streamChat == null) return <LoadingIndicator/> 

    return <Chat client={streamChat}>
        <ChannelList sendChannelsToList filters={{members: {$in: [user.id]}}}/>
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
    
    return <div className="channelsSection"></div>
}