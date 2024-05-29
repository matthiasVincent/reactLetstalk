import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "./context/AuthContext"
import { useContext, useState } from "react"
import { host_port } from "./services/AuthHeader"

export function UserToFollow({user}){
    const fullname = `${user.first_name} ${user.last_name}`
    return(
       <>
        <div className="user">
            <div className="lf">
                <div className="img-cont">
                    <img src={`http://${window.location.hostname}:${host_port}${user.profile_image}`} alt="hi" style={{width: '100%' , height: '100%', borderRadius: '50%'}} />
                </div>
                <div className="some-text">
                    <span>{fullname.length > 12 ? fullname.slice(0, 12) + "..." : fullname}</span>
                    { user.favorite_quote && (
                             <span>{ user.favorite_quote.length > 12 ? user.favorite_quote.slice(0, 12) + "..." : user.favorite_quote}</span>
                    )
                    }
                </div>
            </div>
            <div className="bt-cont">
                <Link to={`/profile/${user.username}`} className="text-white text-decoration-none btn btn-success p-2">View Profile</Link>
            </div>
        </div>
        <hr />
       </>
    )
}


export function FriendRequest({user, logged_in, btn_id}){
    const fullname = `${user.first_name} ${user.last_name}`
    const {accepted, setAccepted} = useContext(AuthContext)
    const [submitting, setSubmitting] = useState(false)

    function handleSubmit(e){
        e.preventDefault()
        const formD = new FormData(e.target)
        setSubmitting(true)
        axios.post(`http://${window.location.hostname}:${host_port}/editprofile/`, formD).then(
            (resp) => resp.data).then((res) => {
                setSubmitting(false)
                setAccepted((prev) => ({...prev, [`${btn_id}`]: 'confirm'}))
            }
        ).catch(error => {
            setSubmitting(false)
            console.log(error)
        })
    }

    return(
       <>
       
       <div className="user">
            <div className="lf">
                <div className="img-cont">
                    <img src={`http://${window.location.hostname}:${host_port}${user.profile_image}`} alt="hi" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                </div>
                <div className="some-text">
                    <span>{fullname.length > 12 ? fullname.slice(0, 12) + "..." : fullname}</span>
                    { user.favorite_quote && (
                      <span>{ user.favorite_quote.length > 12 ? user.favorite_quote.slice(0, 12) + "..." : user.favorite_quote}</span>
                    )
                    }
                </div>
            </div>
            <div className="bt-cont" id="btn-confirm-cont">
                <form  className="accept_form" onSubmit={handleSubmit}>
                    <input type="hidden" className="form-control" value={logged_in.user.username} name="follower" />
                    <input type="hidden" className="form-control" value={user.username} name="following" />
                    <input type="hidden" name="follow" />
                    {accepted[btn_id]? <span className="h5">You are now friends</span> : <button className="btn btn-success p-2">{submitting? "wait.." : "Confirm"}</button>}
                </form>
            </div>
        </div>
        <hr />
       
       </>
    )
}



export function FollowUser({user, logged_in, btn_id}){
    const fullname = `${user.first_name} ${user.last_name}`
    const {btnText, setBtnText} = useContext(AuthContext)
    const [submitting, setSubmitting] = useState(false)
    console.log(btnText)


    function handleSubmit(e){
        e.preventDefault()
        const formD = new FormData(e.target)
        setSubmitting(true)
        axios.post(`http://${window.location.hostname}:${host_port}/editprofile/`, formD).then(
            (resp) => resp.data).then((res) => {
                setBtnText((prev) => ({...prev, [`${btn_id}`]: res.btn_text}))
                setSubmitting(false)
            }
        ).catch(error =>{
            setSubmitting(false)
            console.log(error)
        })
    }

    return(
       <>
       
       <div className="user">
            <div className="lf">
                <div className="img-cont">
                    <img src={`http://${window.location.hostname}:${host_port}${user.profile_image}`} alt="hi" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                </div>
                <div className="some-text">
                    <span>{fullname.length > 12 ? fullname.slice(0, 12) + "..." : fullname}</span>
                    { user.favorite_quote && (
                      <span>{ user.favorite_quote.length > 12 ? user.favorite_quote.slice(0, 12) + "..." : user.favorite_quote}</span>
                    )
                    }
                </div>
            </div>
            <div className="bt-cont" id="btn-confirm-cont">
                <form  className="accept_form" onSubmit={handleSubmit}>
                    <input type="hidden" className="form-control" value={logged_in.user.username} name="follower" />
                    <input type="hidden" className="form-control" value={user.username} name="following" />
                    <input type="hidden" name="follow" />
                    <button className="btn btn-success p-2" >{btnText[btn_id] && submitting? "wait..." : btnText[btn_id]? btnText[btn_id] : submitting? "wait..." : "Follow"}</button>
                </form>
            </div>
        </div>
        <hr />
       
       </>
    )
}