import { useFormik } from "formik"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./context/AuthContext"
import { AuthService } from "./services/AuthService"
import LoginNav from "./LoginNav"
import { Link } from "react-router-dom";
import { Navbar } from "./Navbar"
import SignUp from "./SIgnUp"

const Auth = new AuthService()

export function Login(){
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const {user, setUser} = useContext(AuthContext)

    async function login(username, password){
        const data = await Auth.login(username, password)
        console.log(data)
        setUser(data)
        return data
    }


    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },

        onSubmit: async function(values, {setSubmitting}){
            setSubmitting(true);
            const {username, password} = values;
            try {
            const res = await login(username, password)
            console.log(res)
            navigate('/')
            setSubmitting(false)
            }
            catch(err){
                setError(err.message)
                console.log(err.response.data)
                setSubmitting(false)
            }
        }
    })

    useEffect(
        () => {
            if (user){
                navigate("/")
            }
        }, [user, navigate]
    )


    return(
        <>
        <LoginNav name="Sign up"  element={<SignUp />} route="signup"/>
        <div className="wrapper p-3">
            <p className="h5 bg-success text-white p-2">Login</p>
            {error && (
                 <div className="alert alert-dismissible alert-success fade show my-3" id="at">
                 <button type="button" className="close" data-dismiss="alert">&times;</button>
                  <p className="text-danger text-center">{error}</p>
             </div>
            )}

        <form onSubmit={formik.handleSubmit}>
          
          <div className="username-cont">
            <label htmlFor="user-in">Username: </label>
            <input value={formik.values.username} type="text" onChange={formik.handleChange} name="username" placeholder="Username" className="user-in" id="user-in" required />
          </div>

          <div className="pass-cont">
            <label htmlFor="pass-in">Password: </label>
            <input value={formik.values.password} type="password" onChange={formik.handleChange} name="password" placeholder="Password" className="pass-in" id="pass-in" required />
          </div>
            
            <button type="submit" className="btn btn-primary">{formik.isSubmitting? "Signing in..." : "Login" }</button>
        
            <p>Don't have an account? <Link to="/signup" element={<Navbar />}>Create one</Link></p>
        </form> 
        </div>
        </>
    )
}