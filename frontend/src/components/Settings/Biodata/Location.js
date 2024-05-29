import { AuthContext } from "../../context/AuthContext"
import { useContext, useState } from "react"
import axios from "axios"
import { host_port } from "../../services/AuthHeader"

export function Location(){
    const {user, setUser} = useContext(AuthContext)
    const [location, setLocation] = useState(user.user.location)
    const [isSubmitting, setSubmitting] = useState(false)

    

    function handleChange(e){
        setLocation(e.target.value)
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
                setUser({...user, user: {...user.user, location: resp.data.data.dob}})
                setSubmitting(false)
            }
        ).catch(error => {
            setSubmitting(false)
            console.log(error)
        })
    }

    return (
        <>
            <div className="sec">
                <p className="h5">Edit Location</p>
                <form form-id="location" onSubmit={handleSubmit}>
                    <div className="btn-grp">
                        <label htmlFor="loc" className="form-control-label">Location</label>
                        <input type="text" className="form-control cust" value={location} id="loc" name="location" onChange={handleChange}/>
                    </div>
                    <div className="sub-cont">
                        <input type="hidden" name="location_edit" />
                        <input type="hidden" name="username"  value={user.user.username}/>
                        <input type="submit" className="btn btn-primary p-1 submit" value={isSubmitting? "updating..." : "Save"} name="location_edit" />
                    </div>
                </form>
            </div>
            <hr />
        </>
    )
}