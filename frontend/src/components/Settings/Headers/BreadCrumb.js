import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"

export function BreadCrumb(props){
    const {user} = useContext(AuthContext)

    return (
        <div className="set-nav">
            <ul className="breadcrumb">
                <li className="breadcrumb-item">
                    <p>Account setting for <span className="text-primary">{`${user.user.first_name} ${user.user.last_name}`}</span></p>
                </li>
                <li className="breadcrumb-item">
                    {/* <a href="{% url 'home' %}">
                        Home 
                    </a> */}

                <Link to="/">Home</Link>
                </li>
            </ul>
        </div>
    )
}