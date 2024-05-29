import { AuthContext } from "../../context/AuthContext"
import { useContext, useState } from "react"
import axios from "axios"
import { host_port } from "../../services/AuthHeader"

export function Quote(props){
    const {user, setUser} = useContext(AuthContext)
    const [favorite_quote, setQuote] = useState(user.user.favorite_quote)
    const [isSubmitting, setSubmitting] = useState(false)

    

    function handleChange(e){
        setQuote(e.target.value)
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
                setUser({...user, user: {...user.user, favorite_quote: resp.data.data.favorite_quote}})
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
                <p className="h5">Edit Short Quote</p>
                <form form-id="quote" onSubmit={handleSubmit}>
                    <div className="btn-grp">
                        <label htmlFor="fn" className="form-control-label">Bio</label>
                        <textarea name="bio" id="fn" cols="20" rows="5" className="form-control cust" onChange={handleChange}>{favorite_quote}</textarea>
                    </div>
                    <div className="sub-cont">
                        <input type="hidden" name="quote_edit" />
                        <input type="hidden" name="username"  value={user.user.username}/>
                        <input type="submit" className="btn btn-primary p-1 submit mt-1" value={isSubmitting? "updating..." : "Save"} name="quote_edit" />
                    </div>
                </form>
            </div>
            <hr />
        </>
    )
}