import { Link } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa"
import { ProfileContext } from "../../context/ProfileContext"
import { useContext } from "react"

export function Header(){
    const {profile} = useContext(ProfileContext)

    return(
        <div className="container-fluid bg-dark d-flex justify-content-between align-items-center p-3">
            {profile && <p className="h5 text-white">{`${profile.data.first_name} ${profile.data.last_name}`}</p>}
            <Link to="/" className="h5 text-decoration-none text-white"><FaArrowRight /></Link>
        </div>
    )
}