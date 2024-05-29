import { Navbar } from "./Navbar";
import { AuthContext } from "./context/AuthContext";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { host_port } from "./services/AuthHeader";
import { SocketContext } from "./context/socketContext";
import { FormatPostDate } from "./FormatDate";
import { isOnline } from "./services/AuthHeader";
import { Sent } from "./ReadSeen";
import { OtherUserSeen } from "./ReadSeen";

export function Buddy(){
    const {user, activeStatus, setActiveStatus} = useContext(AuthContext)
    const {buddy, onlines} = useContext(SocketContext)
    console.log(buddy, user)

    useEffect(() => {
        setActiveStatus((prev) => ({...prev, home: '', friends: '', buddy: 'active'}))
    }, [setActiveStatus])

    return(
        <>
            <Navbar activeStatus={activeStatus}/>
            <section className="buddy-container rounded p-0 pl-1">
                <p className="h3 text-dark mb-2">Messages</p>
                <hr />

                <div className="mb-1" id="buddy-list">
                    {/* Buddy container */}
                    {
                        buddy && (
                            buddy.map((message) => <BuddyInfo message={message} user={user} key={message.room_name} onlines={onlines}/>)
                        )
                    }
                  
                </div>
            </section>
        </>
    )
}


function BuddyInfo({message, user, onlines}){
    const fullname_sender = `${message.sender.first_name} ${message.sender.last_name}`
    const fullname_receiver = `${message.receiver.first_name} ${message.receiver.last_name}`
    const today = new Date()
    const meridian = today.getHours > 12? 'PM' : 'AM'
    const timeFormat = today.toTimeString().split(" ")[0] + ` ${meridian}`
    const {unread, setUnread} = useContext(SocketContext)
    const room_unread = unread[message.room_name]
    const {room_read_status} = useContext(SocketContext)
    console.log(room_read_status)
    const whether_read = room_read_status[message?.room_name]

    


    return(
        
        <>
       
            {
                message && (
                    message.sender.username === user.user.username? (
                        <Link to={`/chat/${message.room_name}`} className="text-decoration-none" style={{color: 'rgba(0.0.0,1'}}>
                        <div className="single-friend p-2 d-flex" style={{position: 'relative'}}>
                            <div className="picture-cont">
                                <img src={`http://${window.location.hostname}:${host_port}${message.receiver.profile_image}`} alt="" id="pb" />
                                <div style={
                                    {
                                        position: 'absolute',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: isOnline(onlines, message.receiver.username)? 'lightgreen' : 'wheat',
                                        bottom: '3px',
                                        right: '4%',
                                    }
                                }></div>
                            </div>
                            <div className="friend-det" style={{marginLeft: '10%'}}>
                               <div className="last-msg-info">
                                    <p className="h5 text-dark m-0 p-0">{fullname_receiver.length > 12 ? fullname_receiver.slice(0, 12) + "..." : fullname_receiver}</p>
                                    <p className="last-msg h6 text-dark m-0 p-3" style={{display: 'flex', alignItems: 'center'}}>
                                        <span>&nbsp;You:&nbsp;</span>{message.content?.length > 12 ? message.content?.slice(0, 12) + "..." : message.content}
                                        &nbsp; <code className="text-dark m-0 p-0">{FormatPostDate(message.created)}</code>
                                    </p>
                               </div>
                            </div>
                            <div style={{position: 'absolute', bottom: '20px', right: '10px'}}>
                                {
                                    whether_read ? <OtherUserSeen image_url={`http://${window.location.hostname}:${host_port}${message.receiver.profile_image}`} />
                                    :
                                    <Sent />
                                }
                            </div>
                        </div>
                    </Link>
                    )
                    :
                    (
                        <Link to={`/chat/${message.room_name}`} className="text-decoration-none">
                        <div className="single-friend p-2 d-flex" style={{position: 'relative'}}>
                            <div className="picture-cont">
                                <img src={`http://${window.location.hostname}:${host_port}${message.sender.profile_image}`} alt="" id="pb" />
                                <div style={
                                    {
                                        position: 'absolute',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: isOnline(onlines, message.sender.username)? 'lightgreen' : 'wheat',
                                        bottom: '3px',
                                        right: '4%',
                                    }
                                }></div>
                            </div>
                            {
                                room_unread == 0?
                                <div className="friend-det" style={{marginLeft: '10%'}}>
                                <p className="h5 text-dark m-0 p-0">{fullname_sender.length > 12 ? fullname_sender.slice(0, 12) + "..." : fullname_sender}</p>
                                    <p className="last-msg h6 text-dark m-0 p-3" style={{display: 'flex', alignItems: 'center'}}>
                                    {message.content?.length > 12 ? message.content?.slice(0, 12) + "..." : message.content}
                                    &nbsp; <code className="text-dark m-0 p-0">{FormatPostDate(message.created)}</code> </p>
                            </div>
                            :
                            <div className="friend-det" style={{marginLeft: '10%'}}>
                                <p className="h5 text-dark m-0 p-0"><b>{fullname_sender.length > 12 ? fullname_sender.slice(0, 12) + "..." : fullname_sender}</b></p>
                                    <p className="last-msg h6 text-dark m-0 p-3" style={{display: 'flex', alignItems: 'center'}}>
                                    <b>
                                    <span className="un-read-msg"
                                        style={{
                                            display: 'inline-flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            padding: '2px 3px',
                                            backgroundColor: 'red',
                                }}><code style={{color: 'white', fontSize: '10px', fontWeight: 600}}>{room_unread}</code></span>
                                        &nbsp; {message.content?.length > 12 ? message.content?.slice(0, 12) + "..." : message.content}
                                    &nbsp; <code className="text-dark m-0 p-0">{FormatPostDate(message.created)}</code></b></p>
                            </div>
                            }
                        </div>
                    </Link>
                    )
                )
            }

        </>
        
    )
}