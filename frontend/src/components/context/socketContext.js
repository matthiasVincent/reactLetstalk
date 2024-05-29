import { createContext, useState } from "react";
import useWebSocket, {ReadyState} from 'react-use-websocket'
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import { sortConversationMessages } from "../services/AuthHeader";
import { host_port } from "../services/AuthHeader";



export const SocketContext = createContext('')

export function SocketContextProvider({children}){
    const [buddy, setBuddy] = useState([])
    const {user, setUser} = useContext(AuthContext)
    const [onlines, setOnlines] = useState([])
    const [unread, setUnread] = useState(0)
    const [room_read_status, setStatus] = useState({})

    const {socketStatus} = useWebSocket(`ws://${window.location.hostname}:${host_port}/notifications/`, {
        queryParams: {
            token: user ? user.token : "",
          },
        onOpen: () => console.log("connected"),

        onClose: () => console.log("closed"),

        onMessage: (e) => {
            const messages = JSON.parse(e.data)
            switch (messages.type){
                case 'previous_conversations':
                    console.log(messages)
                    const buddy_list = sortConversationMessages(messages)
                    setBuddy(buddy_list)
                    break
                
                    case 'room_read':
                        console.log(messages)
                        setStatus(messages.room_read_status)
                        break
                case 'new_message':
                    console.log(messages)
                    setBuddy((prev) => [messages.message, ...prev.filter((buddy) => buddy.room_name !== messages.message.room_name)])
                    setStatus((prev) => ({...prev, ...prev[messages.message.room_name] = false}))
                    break
                case 'updated_active_users':
                    console.log(messages)
                    setOnlines(messages.users)
                    break
                case 'unread_messages':
                    setUnread(messages.count)
                    console.log(messages.count)
                    break
                    //setUser({...user, user: {...user.user, active_status: messages.updated_user.active_status}})
                case 'notify_unread':
                    // if the sender is not auth_user, increment unread for this room
                    // otherwise, do nothing
                    console.log(room_read_status)
                    // setStatus((prev) => ({...prev, ...prev[messages.room_name] = false}))
                    if (messages.sender !== user?.user.username){
                        setUnread((prev) => ({...prev, [messages.room_name]: prev[messages.room_name] + 1}))
                    }
                    else {
                        setStatus((prev) => ({...prev, ...prev[messages.room_name] = false}))
                        console.log("I just sent message", room_read_status)
                    }
                    console.log(unread)
                    break
                case 'chat_room_read':
                    // if the sender is not the auth user for this room, decrement unread
                    // otherwise, do nothing
                    setStatus((prev) => ({...prev, ...prev[messages.room_name] === false? true : prev[messages.room_name]}))
                    if (messages.sender !== user?.user.username){
                        setUnread((prev) => ({...prev, [messages.room_name]: prev[messages.room_name] - 1}))
                        console.log(` You just read message from ${messages.sender}`)
                    }
                    else{
                        console.log(`The other user just read your message`)
                        setStatus((prev) => ({...prev, ...prev[messages.room_name] = true}))
                        console.log(room_read_status)
                    }
                    console.log(unread)
                    break
                case 'message_read':
                    setStatus((prev) => ({...prev, ...prev[messages.room_name] = true}))
                    console.log("You just told your friend u saw his message", messages)
                    break;

                default:
                    console.log("Something went wrong")
                    break
            }
        }
    })

    const status = {
        [ReadyState.OPEN]: 'open',
        [ReadyState.CLOSED]: 'closed',
        [ReadyState.CLOSING]: 'closing',
        [ReadyState.CONNECTING]: 'connecting',
        [ReadyState.UNINSTANTIATED]: 'uninstantiated',
    }[socketStatus]


    return(
        <SocketContext.Provider value={{buddy, setBuddy, onlines, setOnlines, unread, setUnread, room_read_status, setStatus}}>
            {children}
        </SocketContext.Provider>
    )
}