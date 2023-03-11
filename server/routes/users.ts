import { FastifyInstance } from "fastify";
import {StreamChat} from "stream-chat"

// get access to my stream chat 
const streamChat = StreamChat.getInstance(process.env.STREAM_API_KEY!, process.env.STREAM_PRIVATE_API_KEY!)

export async function userRoutes(app:FastifyInstance) {
    app.post<{Body: {id:string, name: string, url?: string}}>
    ("/signup",async (req,res) => {
        const {id, name, url} = req.body

        // check for null
        if (id==null || name == null || id === "" || name ==="") {
            return res.status(400).send ("Null or Empty fields") 
        }

        // check for existing users with same id
        const existingUsers = await streamChat.queryUsers({id})
        if (existingUsers.users.length > 0){
            return res.status(400).send("Users ID taken")
        }

        // add new user
        await streamChat.upsertUser({id, name, url}) 
    })

    app.post<{Body: {id:string}}> 
    ("/login",async (req,res) => {
        const {id} = req.body

        // check for null
        if (id==null ||  id === "" ) {
            return res.status(400).send ("Null or Empty id") 
        }

        // check for existing users with same id
        const existingUsers = await streamChat.queryUsers({id})
        if (existingUsers.users.length > 0){
            return res.status(400).send("Users ID taken")
        }

        // login user 
        
    })
} 