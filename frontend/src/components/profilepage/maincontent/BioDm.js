import { ProfileContext } from "../../context/ProfileContext"
import { useContext, useState, useEffect, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
import axios from "axios"
import { host_port } from "../../services/AuthHeader"

export default function BioDm(){
    const {profile} = useContext(ProfileContext)
    const {user} = useContext(AuthContext)
    
    return(
        <div className="basic m-0 pl-2 py-4 mt-4" style={{backgroundColor: 'white'}}>
            {
                profile &&  (
                    <>
                        <p className="h2" style={{fontWeight: 500}}>{`${profile.data.first_name} ${profile.data.last_name}`}</p>
                        <p className="h5">{profile.data.favorite_quote}</p>
                        {user?.user.username !== profile?.data.username ? <SendMessage /> : ''}
                        <MessageModal profile={profile} user={user} />
                        { user?.user.username === profile.data.username ? <EditProfile /> : ''}

                    </>
                )
            }
        </div>
    )
}

function SendMessage(){
    return (
        <Link to="#"role="button" data-toggle="modal" data-target="#dm" className="text-decoration-none">
                    Send Message
        </Link>
    )
}

function EditProfile(){
    return(
        <div className="d-flex justify-content-start">
            <button 
            className="btn btn-primary mb-2 py-2 px-3 d-flex align-items-center" 
            style={{width: '170px', fontSize: '17px', fontWeight: 600}}><FaPlus className="mr-1"/><span>Add to Stories</span></button>
            <Link to='/settings' className="btn btn-success mb-2 py-2 ml-3 px-3 text-decoration-none" style={{width: '150px', fontSize: '17px', fontWeight: 600}}>Edit Profile</Link>
        </div>
    )
}

function MessageModal({profile, user=''}){
    const [dm, setDm] = useState('')
    const [sending, setSending] = useState(false)
    const [feedbck, setFeedbck] = useState('')
    const [error, setError] = useState('')
    const [sender, setSender] = useState(user?.user.username)
    const [receiver, setReceiver] = useState(user?.user.last_name)
    const [senderLastName, setSenderLastName] = useState(profile?.data.username)
    const [receiverLastName, setReceiverLastName] = useState(profile?.data.last_name)
    const [message, setMessage] = useState('')
    const InputRef = useRef(null)
    console.log(message, feedbck)

    const resizeTextArea = () => {
        InputRef.current.style.height = 'auto'
        InputRef.current.style.maxHeight = 80 + "px"
        InputRef.current.style.height = InputRef.current.scrollHeight + 'px'
    }


    useEffect(resizeTextArea, [message])

    const handleChange = (e) => {
        setMessage(e.target.value)
    }

    async function sendDm(data){
        const response = await axios.post(`http://${window.location.hostname}:${host_port}/editprofile/`, data);
        //console.log(response)
        return response.data
    }

    async function handleSubmit(e){
        const formD = new FormData(e.target)
        e.preventDefault()
        if (message === ''){
            setError("Nothing to submit")
            return
        }
        const data = {dm, sender, senderLastName, receiver, receiverLastName, message}
        setSending(true)
        try {
            const response = await sendDm(formD)
            setFeedbck(response.status)
            setSending(false)
            setMessage('')
        }

        catch (error){
            console.log(error)
            setError("Can't send message")
            setSending(false)
            setMessage('')
        }

    }
    return(
        <div className="modal fade" id="dm">
        <div className="modal-dialog fixed-bottom">
            <div className="modal-content">
                <div className="modal-header">
                    {
                        feedbck && feedbck !== '' ? <h5 className="modal-title text-success" id="dm-feedback">{feedbck}</h5>
                        :
                        error && error !== '' ? <h5 className="modal-title text-danger" id="dm-feedback">{error}</h5>
                        :
                        <h5 className="modal-title text-dark" id="dm-feedback">Message {`${profile?.data.first_name} ${profile?.data.last_name}`}</h5>
                    }
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                </div>
                <div className="modal-body table-light">
                    <form className="py-2" onSubmit={handleSubmit}
                        style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <input type="hidden" name="sender" value={user?.user.username} />
                        <input type="hidden" name="sender_lastname" value={user?.user.last_name} />
                        <input type="hidden" name="receiver" value={profile?.data.username} />
                        <input type="hidden" name="receiver_lastname" value={profile?.data.last_name} />
                        <input type="hidden" name="dm" />
                        <textarea name="message" cols="30" rows="3"
                            style={{resize: 'none',  border: '1px solid gray', borderRadius: '5px',  outline: 'none', overflowY: 'hidden', display: 'inline-block'}} 
                            placeholder="Type your message" 
                            className="p-2 pb-4"
                            value={message} 
                            onChange={handleChange}
                            ref={InputRef}
                            ></textarea>
                        <button type="submit" className="btn btn-success p-2 m-0 ml-2">{sending? '...' : 'send'}</button>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger p-2" data-dismiss="modal">close</button>
                </div>
            </div>
        </div>
    </div>
    )
}