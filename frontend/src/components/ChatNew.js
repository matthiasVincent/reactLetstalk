import { useParams } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "./context/AuthContext";
import { SocketContext } from "./context/socketContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { host_port } from "./services/AuthHeader";
import { FaPaperPlane } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa";
import useWebSocket, {ReadyState} from 'react-use-websocket'
import { formatMessageDate } from "./Utils";
import { Link } from "react-router-dom";
import { formatNewLine } from "./Utils";
import { buddyUsername } from "./Utils";

export function ChatNew(){
    const [messageHistory, setMessageHistory] = useState([])
    const {room_name} = useParams()
    //console.log(typeof(room_name))
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()
    const [profile, setProfile] = useState('')
    const {setUnread} = useContext(SocketContext)
    const {room_read_status, setStatus} = useContext(SocketContext)

    // todo refactor this
    const friendName = buddyUsername(room_name, user)
    //console.log(profile)
    //console.log(messageHistory)

    const {readyState, sendJsonMessage} = useWebSocket(`ws://${window.location.hostname}:${host_port}/ws/${room_name}/`,
    {
            queryParams: {
                    token: user ? user.token : "",
                },
            onOpen: () => {
            console.log("connected!")
            sendJsonMessage({
                type: "set_read",
                room_name,
                friendName,
            })
            },
            onClose: () => {
            console.log("Disconnected")
            },
            onMessage: (e) => {
            const data = JSON.parse(e.data)
            switch (data.type){
            case "previous_messages":
                //console.log(data)
                setMessageHistory(data.message.reverse())
                break;
            case "chat_message":
                console.log(data)
                setMessageHistory((prev) => prev.concat(data.message))
               // console.log(messageHistory)
                if (data.sender !== user?.user.username){
                    console.log("To be marked read")
                    sendJsonMessage({
                        type: "seen",
                        message_id: data.message.id,
                        sender: data.sender,
                        room_name: data.message.room_name,
                    })
                }
                else{
                    console.log("Not for me")
                }
                break;
            // case 'message_read':
            //     console.log("Your friend just read your message")
            //     setStatus((prev) => ({...prev, ...prev[data.room_name] = true}))
            //     break;
            case "notify_read":
                setUnread((prev) => ({...prev, [data.room_name]: 0}))
                setStatus((prev) => ({...prev, ...prev[data.room_name] === false? true : prev[data.room_name]}))
                console.log(data.room_name)
                console.log("Message seen and read", room_read_status)
                break

            default:
                console.log("Notsupported")
                break;
            }
  }
})

  const status = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState]


    const handleNavigate = () => {
        navigate(-1)
    }

    // const buddyUsername = (room) => {
    //     const usernamesPlus = room_name.split('_')
    //     const usernamesArray = [usernamesPlus[0].substring(0, 11), usernamesPlus[1].substring(0, 11)]
    //     for (let username of usernamesArray){
    //         if (username !== user?.user.username){
    //             return username
    //         }
    //     }
    // }
    // const friendName = buddyUsername(room_name)

    useEffect(() => {
        async function getUser(){
            try{
                const response = await axios.get(`http://${window.location.hostname}:${host_port}/profile/${friendName}/`)
                setProfile(response.data)
            }
            catch(err){
                console.log(err)
            }
        }
        getUser()
    }, [friendName])


    const myRef = useRef(null)

    useEffect(() => {
        
        console.log('mounted')
        console.log(myRef.current)
        window?.scrollTo(0, myRef.current?.scrollHeight)
        

    }, [messageHistory])

    return(
       <>
        {
            profile &&  (
            <>
                <RoomHeader profile={profile} onHandleNavigate={handleNavigate} />
                 <div className="msg-cont" ref={myRef}>
                    <MessageContainer profile={profile} messages={messageHistory} />
                    <TypeMessage profile={profile} onSendJsonMessage={sendJsonMessage} />
                </div>
            </>
            )
        }
       </>
    )
}




function RoomHeader({profile, onHandleNavigate}){
    return(
        <div className="container-fluid bg-dark d-flex justify-content-between align-items-center p-3 sticky-top">
            <div role="button" onClick={onHandleNavigate}  className="h5 text-white"><FaArrowLeft /></div>
            <div className="pf" style={{width: '40px', height: '40px', borderRadius: '50%'}}>
                <img src={`http://${window.location.hostname}:${host_port}${profile?.data.profile_image}`}
                    alt=""
                    style={{width: '100%', height: '100%', borderRadius: '50%'}} className="bg-dark" 
                 />
            </div>
        </div>
    )
}


function MessageContainer({profile, messages, onRef}){
    const fullname = `${profile?.data.first_name} ${profile?.data.last_name}`
    const quote = profile?.data.favorite_quote

    return(
        <div id="msg_div">
            <div className="container w-sm-100  d-flex justify-content-center flex-column align-items-center">
                <div className="pf" style={{width: '60px', height: '60px', borderRadius: '50%'}}>
                    <img src={`http://${window.location.hostname}:${host_port}${profile?.data.profile_image}`}
                        alt=""
                        style={{width: '100%', height: '100%', borderRadius: '50%'}} className="bg-dark" 
                    />
                </div>
            <div className="d-flex flex-column ml-3 p-0 justify-content-center align-items-center" style={{fontSize: '14px', fontWeight: 500}}>
                <p className="text-dark p-0 m-0">{fullname}</p>
                <p className="text-dark p-0 m-0">{quote}</p>
                <p className="text-dark p-0 m-0">This is the beginning of you chat with <small className="text-success">{fullname}</small></p>
            </div>
            </div>
            {
                messages && (
                    messages.map((message) => <Conversation message={message} key={message?.id}/>)
                )
            }
        </div>
    )
}


function TypeMessage({profile, onSendJsonMessage}){
    const[focus, setFocus] = useState(false)
    const [msg, setMsg] = useState('')
    const {user} = useContext(AuthContext)
    const textInputRef = useRef(null)
    
    const handleFocus = () =>{
        setFocus(true)
    }

    const handleBlur = () => {
        setFocus(false)
    }

    const resizeTextArea = () => {
        textInputRef.current.style.height = 'auto'
        textInputRef.current.style.maxHeight = 80 + "px"
        textInputRef.current.style.height = textInputRef.current.scrollHeight + 'px'
    }

    useEffect(resizeTextArea, [msg])


    const handleChange = (e) => {
        setMsg(e.target.value)
    }

    const handleSend = (e) => {
        e.preventDefault()
        if (msg === ''){
            return
        }
        onSendJsonMessage(
            {
                type: 'chat_message',
                message: msg,
                sender: user?.user.username,
            }
        )
        setMsg('')
    }

    return(
        <div className="send-cont">
            <label htmlFor="lb" className={`${focus? 'd-none' : 'd-block'}`}>
                <FaFileImage className="text-primary icons" />
            </label>
            <input type="file" className="d-none" id="lb" name="pic-message" />
            <textarea  rows="1" className="w-100 mr-2 p-2" placeholder="Type a message" 
                style={{resize: 'none', display: 'inline-block', overflowY: 'hidden', borderRadius: '25px'}} 
                name="msg" id="msg"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                value={msg}
                ref={textInputRef}
                required></textarea>

            <input type="hidden" name="profile" value={profile?.data.username} />

            <button type="submit" id="sub" style={{borderRadius: '50%'}} onClick={handleSend}><FaPaperPlane className="text-primary icons" /></button>
        </div>
    )
}

function Conversation({message}){
    const {user} = useContext(AuthContext)
    return(
        message?.sender.username !== user.user.username?
        (
            <>
              <div className="d-flex justify-content-center my-2 text-dark"><small style={{fontSize:'12px'}}>{formatMessageDate(message?.created)}</small></div>
              <div className="profile-cont p-3 mb-3 d-flex">
                <Link to={`/profile/${message?.sender.username}/`} className="text-decoration-none text-white">
                    <div className="chat-buddy" style={{width: '30px', height: '30px', borderRadius: '50%'}}>
                        <img 
                        src={`http://${window.location.hostname}:${host_port}${message?.sender.profile_image}`} 
                        alt="" 
                        style={{width: '100%', height: '100%', borderRadius: '50%'}} className="bg-dark"
                         />
                    </div>
                </Link>
                <div className="ml-2 text-justify p-2" style={{borderRadius: '10px', backgroundColor: 'whitesmoke', display: 'flex', alignItems: 'center'}}>
                    <p className="text-dark p-0 m-0" style={{fontSize: '12px'}}
                    dangerouslySetInnerHTML={{__html: formatNewLine(message?.content)}}></p>
                </div>
              </div>
            </>
        )
        :
        (
            <>
                <div className="d-flex justify-content-center my-2 text-dark"><small style={{fontSize:'12px'}}>{formatMessageDate(message?.created)}</small></div>
                <div className="chat-wrap" style={{display: 'flex', justifyContent:'flex-end'}}>
                    <div className="bg-success mb-3 p-2 text-justify" style={{display: 'flex', alignItems: 'center', borderRadius: '10px'}}>
                        <p className="text-white p-0 m-0" style={{fontSize: '12px', color: 'black'}}
                        dangerouslySetInnerHTML={{__html: formatNewLine(message?.content)}}></p>
                    </div>
                </div>

            </>
        )
    )
}