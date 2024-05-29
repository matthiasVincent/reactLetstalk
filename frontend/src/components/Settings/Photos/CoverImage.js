import { AuthContext } from "../../context/AuthContext"
import { useContext, useState } from "react"
import axios from "axios"
import { host_port } from "../../services/AuthHeader"


export function CoverImage(props){
    const {user, setUser} = useContext(AuthContext)
    const [coverImage, setCoverImage] = useState('')
    const [fileName, setFileName] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)
    console.log(coverImage)

    function handleChange(e){
        setCoverImage(e.target.value)
        setFileName("Selected file: " + e.target.value.substring(0, 15))
    }

    function handleSubmit(e){
        e.preventDefault()
        const formD = new FormData(e.target)
        for (const [k,v] of formD){
            console.log(k,v)
        }
        //console.log({...user, user: {...user.user, first_name:"something"}})
        setSubmitting(true)
        axios.post(`http://${window.location.hostname}:${host_port}/editprofile/`, formD).then(
            (resp) => {
                setUser({...user, user: {...user.user, cover_image: resp.data.data.cover_image}})
                setSubmitting(false)
                setFileName('')
            }

        ).catch(error => {
            setSubmitting(false)
            console.log(error)
            setFileName('')
        })
    }

    return (
        <>
            <div className="sect-cont">
                <p className="hd">Cover Pics</p>
                <div className="img-con d-flex flex-column">
                    <div className="cont-img mb-3">
                        <img src={`http://${window.location.hostname}:${host_port}${user.user.cover_image}`} alt="Profile Pics" className="w-100 h-100" id="cover_pic" />
                    </div>
                    <form onSubmit={handleSubmit} encType="multipart/form-data" form-id="cover_pic">
                        <label htmlFor="cp" className="btn btn-outline-success py-1 px-1 m-0 mb-2">Choose File</label>
                        <input type="file" className="form-control mb-2 d-none" id="cp" name="cover_img" value={coverImage} onChange={handleChange}/>
                        <input type="hidden" name="cover_img_edit" />
                        <input type="hidden" name="username"  value={user.user.username}/>
                        <div className="file-name"><code>{fileName}</code></div>
                        <button type="submit" className="btn btn-primary py-1 px-1 -0 mb-2 submit" value="cover" name="cover_img_edit">{isSubmitting? "updating..." : "Save Photo"}</button>
                    </form>
                </div>
            </div>
            <hr />
        </>
    )
}