import { Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"

export function MainHeader({onHandleNavigate}){
    const {user} = useContext(AuthContext)
    //console.log(user.user)

    return (
        <div className="container-fluid bg-dark d-flex justify-content-between align-items-center p-3 sticky-top">
            <Link onClick={onHandleNavigate} className="text-white p-0 m-0 h5" role="button"><FaArrowLeft /></Link>
            {/* <a  href="{% url 'home' %}" class="text-white p-0 m-0 h5"><i class="fa fa-arrow-left"></i></a> */}
            <p className="text-white p-0 m-0 h5">{`${user.user.first_name} ${user.user.last_name}`}</p>
        </div> 
    )
}