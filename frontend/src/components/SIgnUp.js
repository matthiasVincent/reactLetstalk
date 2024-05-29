import { Link } from "react-router-dom";
import { Login } from "./Login";
import { useState} from "react";
import { useNavigate } from "react-router-dom";
import LoginNav from "./LoginNav";
import axios from "axios";
import { host_port } from "./services/AuthHeader";

axios.defaults.xsrfCookieName='csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.withCredentials = true


export default function SignUp(){
    const navigate = useNavigate()
    const [passStatus, setPassStatus] = useState("hide");
    const [password, setPassword] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [username, setPhoneNum] = useState("")
    const [confirm, setConfirm] = useState("")
    const [gender, setGender] = useState("")
    const [dob, setDob] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")


    function handleFirstNameChange(e){
        setFirstName(e.target.value)
    }

    function handleLastNameChange(e){
        setLastName(e.target.value)
    }

    function handlePhoneNoChange(e){
        setPhoneNum(e.target.value)
    }

    function handlePasswordChange(e){
        setPassword(e.target.value)
    }

    function handleConfirmChange(e){
        if (confirm !== ""){
            password === e.target.value ? setPassStatus("hide"): setPassStatus("show")
        }
        setConfirm(e.target.value)
    }

    function handleGender(e){
        console.log(gender)
        setGender(e.target.value)
    }

    function handleDobChange(e){
        setDob(e.target.value)
    }
   
    async function signup(data, config){
        const response = await axios.post(`http://${window.location.hostname}:${host_port}/signup/`, data, config);
        if (!response.data.status){
            return response.data
        }
        return response.data
    }

    async function handleSubmit(e){
        e.preventDefault()
        const data = {first_name, last_name, password, username, gender, dob}
        const header = {
            "X-CSRFTOKEN": document.cookie.split("=")[1],
        }
        const config = {
            headers: header,
        }
        setSubmitting(true)
        try {
            const response = await signup(data, config)
            setSubmitting(false)
            console.log(response)
            navigate('/login')
        }

        catch (error){
            console.log(error)
            setError(error.message)
            setSubmitting(false)
        }

    }



    return(
        <>
        <LoginNav name="Login"  element={<Login />} route="login"/>
        <div className="wrapper p-3 bg-light">
            <p className="h5 bg-success text-white p-2">Sign Up</p>
            {error && (
                 <div className="alert alert-dismissible alert-success fade show my-3" id="at">
                 <button type="button" class="close" data-dismiss="alert">&times;</button>
                  <p className="text-danger text-center">{error}</p>
             </div>
            )}

        <form onSubmit={handleSubmit}>
          
          <div className="username-cont">
            <label htmlFor="first-name">First Name: </label>
            <input value={first_name} type="text" onChange={handleFirstNameChange} name="firstName" placeholder="First Name" className="first-name" id="first-name"/>
            <label htmlFor="last-name">Last Name: </label>
            <input value={last_name} type="text" onChange={handleLastNameChange} name="LastName" placeholder="Last Name" className="last-name" id="last-name" />
            <label htmlFor="phone-no">Phone No: </label>
            <input value={username} type="text" onChange={handlePhoneNoChange} name="phone-no" placeholder="Phone Number" className="phone-no" id="phone-no"/>
          </div>

          <div className="pass-cont">
            <label htmlFor="pass-in">Password: </label>
            <input value={password} type="password" onChange={handlePasswordChange} name="password" placeholder="Password" className="pass-in" id="pass-in" required />
            <label htmlFor="pass-conf">Confirm password: </label>
            <input value={confirm} type="password" onChange={handleConfirmChange} name="confirm" placeholder="Confirm password" className="pass-conf" id="pass-conf" required />
            <div className={passStatus}>Your passwords did not match!</div>
            {/* Shown when password and confirm password did not match */}
            <label htmlFor="dob">DOB: </label>
            <input value={dob} type="date" onChange={handleDobChange} name="dob" placeholder="mm-dd-yyyy" className="dob" id="dob"/>
            
            <label htmlFor="gender">Gender: </label>
            <select id="gender" value={gender} name="gender" onChange={handleGender}>
                <option value=''>--select gender--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
          </div>
            
            <button type="submit" className="btn btn-primary">{submitting? "Creating your account..." : "SignUp" }</button>
        
            <p>Already have account? <Link to="/login" element={<Login />}>Login</Link></p>
        </form> 
        </div>
        </>
    )
}