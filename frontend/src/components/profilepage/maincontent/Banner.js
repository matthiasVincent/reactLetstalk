import { ProfileContext } from "../../context/ProfileContext"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import { host_port } from "../../services/AuthHeader"

export default function Banner(){
    const {profile} = useContext(ProfileContext)
    const {user} = useContext(AuthContext)
    console.log(profile.data)
    return(
        <div className="cover-photo" style={{height: '300px'}}>
            <CoverPhoto profile={profile}/>
            <ActivityInfo profile={profile} user={user}/>
        </div>
    )
}

function CoverPhoto({profile}){
    return(
        <>
        {
            profile && <img src={`http://${window.location.hostname}:${host_port}${profile.data.cover_image}`} alt="" style={{width: '100%', heigh: '50%', objectFit: 'cover'}} />
        }
        </>
    )
}

function ActivityInfo({profile, user}){
    const {btnText, setBtnText} = useContext(AuthContext)
    const [submitting, setSubmitting] = useState(false)
    console.log(btnText)


    function handleSubmit(e){
        e.preventDefault()
        const formD = new FormData(e.target)
        setSubmitting(true)
        axios.post(`http://${window.location.hostname}:${host_port}/editprofile/`, formD).then(
            (resp) => resp.data).then((res) => {
                setBtnText((prev) => ({...prev, [`${profile.data.id_user}`]: res.btn_text}))
                setSubmitting(false)
            }
        ).catch(error =>{
            setSubmitting(false)
            console.log(error)
        })
    }
    return(
        <div className="follow">
            {
                profile && (
                    <>
                        <span>{profile.data.all_posts > 0? (profile.data.all_posts > 1 ? profile.data.all_posts + " posts" : profile.data.all_posts + ' post') : "No post"}</span>
                        <span>{profile.data.followers > 0? (profile.data.followers > 1 ? profile.data.followers + " followers" : profile.data.followers + ' follower') : "No follower"}</span> 
                        <span>{profile.data.followings > 0? (profile.data.followings > 1 ? profile.data.followings + " followings" : profile.data.followings + ' following') : "No following"}</span>
                    </>
                )
            }
            {
                profile &&
                (user?.user.username !== profile.data.username? (
                    <span>
                        <form  className="accept_form" onSubmit={handleSubmit}>
                            <input type="hidden" className="form-control" value={user?.user.username} name="follower" />
                            <input type="hidden" className="form-control" value={profile.data.username} name="following" />
                            <input type="hidden" name="follow" />
                            <button className="btn btn-success p-2" >{btnText[profile.data.id_user] && submitting? "wait..." : btnText[profile.data.id_user]? btnText[profile.data.id_user] : submitting? "wait..." : "Follow"}</button>
                        </form>
                    </span>
                )
                :
                '')
            }
        </div>
    )
}