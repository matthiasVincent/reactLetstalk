import { AuthContext } from "../../context/AuthContext"
import { useContext, useState } from "react"
import axios from "axios"
import { host_port } from "../../services/AuthHeader"

export function ProfileImage(){
    const {user, setUser} = useContext(AuthContext)
    const [profileImage, setProfileImage] = useState('')
    const [fileName, setFileName] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)

    function handleChange(e){
        setProfileImage(e.target.value)
        setFileName("Selected file: " + e.target.value.substring(0, 15))
    }

    function handleSubmit(e){
        e.preventDefault()
        const formD = new FormData(e.target)
        for (const [k,v] of formD){
            console.log(k,v)
        }
       
        setSubmitting(true)
        axios.post(`http://${window.location.hostname}:${host_port}/editprofile/`, formD).then(
            (resp) => {
                setUser({...user, user: {...user.user, profile_image: resp.data.data.profile_image}})
                setSubmitting(false)
                setFileName('')
            }
        ).catch(error => {
            setSubmitting(false)
            setFileName('')
            console.log(error)
        })
    }

    return (
     <>
        <div className="sect-cont">
            <p className="hd">Profile Pics</p>
            <div className="img-con">
                <div className="cont-img mb-3">
                    <img src={`http://${window.location.hostname}:${host_port}${user.user.profile_image}`} alt="Profile Pics" className="w-100 h-100" id="profile_pic" />
                </div>
                <form onSubmit={handleSubmit} method="post"  encType="multipart/form-data" form-id="profile_pic">
                    <label htmlFor="prp" className="btn btn-outline-success py-1 m-0 mb-2">Choose File</label>
                    <input type="file" className="form-control mb-2 d-none" name="profile_img" id="prp" value={profileImage} onChange={handleChange}/>
                    <input type="hidden" name="profile_img_edit" />
                    <input type="hidden" name="username"  value={user.user.username}/>
                    <div className="file-name"><code>{ fileName }</code></div>
                    <button type="submit" className="btn btn-primary py-1 m-0 mb-2 submit" name="profile_img_edit" value="profile">{isSubmitting? "updating..." : "Save photo"}</button>
                </form>
            </div>
        </div>
        <hr />
     </>
    )
}