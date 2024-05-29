import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"
import { useState } from "react"
import axios from "axios"
import { host_port } from "../../services/AuthHeader"


export function Names(){
    const {user, setUser} = useContext(AuthContext)
    const [last_name, setLastName] = useState(user.user.last_name)
    const [first_name, setFirstName] = useState(user.user.first_name)
    const [isSubmitting, setSubmitting] = useState(false)

    //console.log(getCookie('csrftoken'))
    //console.log(document.cookie)
    function handleFirstChange(e){
        setFirstName(e.target.value)
    }

    function handleLastChange(e){
        setLastName(e.target.value)
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
                setUser({...user, user: {...user.user, first_name:resp.data.data.first_name, last_name: resp.data.data.last_name}})
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
                <p className="hd">Edit Name</p>
                <form  form-id="name" onSubmit={handleSubmit}>
                    <div className="btn-grp">
                        <label htmlFor="fn" className="form-control-label">First Name</label>
                        <input type="text" className=" form-control cust" value={first_name} id="fn" name="first_name" onChange={handleFirstChange} />
                    </div>
                    <div className="btn-grp">
                        <label htmlFor="ln" className="form-control-label">Last Name</label>
                        <input type="text" className="form-control cust" value={last_name} id="ln" name="last_name" onChange={handleLastChange} />
                    </div>
                    <div className="sub-cont">
                        <input type="hidden" name="name_edit" />
                        <input type="hidden" name="username"  value={user.user.username}/>
                        <input type="submit" className="btn btn-primary p-1 submit" value={isSubmitting? "updating..." : "Save"} name="name_edit" />
                    </div>
                </form>
            </div>
            <hr />
        </>
    )
}