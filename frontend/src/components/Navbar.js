import React, { useState } from "react";
import { Link} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { SocketContext } from "./context/socketContext";
import { useContext } from "react";
import { AuthService } from "./services/AuthService";
import { useNavigate } from "react-router-dom";
import { FaFacebookMessenger } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaWrench } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { host_port } from "./services/AuthHeader";

const Auth = new AuthService()

export function Navbar({activeStatus}){
    const navigate = useNavigate()
    const {user, setUser} = useContext(AuthContext)
    const [drop, setDrop] = useState(false)
    const {unread} = useContext(SocketContext)

    const count = Array.from(Object.values(unread)).reduce((prev, curr) => curr = curr + prev, 0)
    
    console.log(count)

    function handleDrop(){
        setDrop((prev) => !prev)
    }
    

    function handleClick(){
        Auth.logout()
        setUser(null)
        navigate("/login")
    }
    return(
        <nav className="navbar">
            <div className="up-wrapper p-2">
                <div className="app-name">
                    <h5 className="text-white m-0">Letstalk</h5>
                </div>
               <Link to='/search' className="search">
                    <FaSearch className="text-light" style={{fontSize: '20px'}} />
               </Link>
            </div>

            <div className="down-wrapper p-2">
                <ul className="nav-icons m-0 p-0">
                    <li className="ref">
                        <Link to="/" className={`icons ${activeStatus.home} p-2 px-3`} >
                            <FaHome style={{fontSize: '20px'}} className="text-light" />
                        </Link>
                    </li>
                    <li className="friend-request">
                        <Link to='/friends' className={`icons ${activeStatus.friends} p-2 px-3`} >
                            <FaUserFriends style={{fontSize: '20px'}} className="text-light" />
                        </Link>
                    </li>
                    <li className="chat-message">
                        <Link to='/buddy-list' className={`icons ${activeStatus.buddy} p-2 px-3`} style={{position: 'relative', display: 'inline-block'}}>
                            <FaFacebookMessenger style={{fontSize: '20px'}} className="text-light" />
                            { 
                             count > 0?
                            (
                            <div className="un-read-msg"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                width: '18px',
                                height: '18px',
                                zIndex: 10,
                                borderRadius: '50%',
                                padding: '2px 3px',
                                backgroundColor: 'red',
                            }}><code style={{color: 'white', fontSize: '10px'}}>{count}</code></div>
                            )
                            :
                            ''
                        }
                        </Link>
                    </li>
                    <li className="drop-profile" style={{position: 'relative'}}>
                        <div role="button" className="drop">
                            <div className="img-cont" style={{width: '30px', height: '30px', borderRadius: '50%'}} onClick={handleDrop}>
                                <img src={`http://${window.location.hostname}:${host_port}${user?.user.profile_image}`} alt='hi' style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                            </div>
                        </div>
                        <ul className={drop===true? `drop-items show mt-3 p-3` : 'drop-items hide mt-3 p-3'}>
                            <li>
                                <Link to="/settings" className="text-decoration-none text-dark"><FaWrench />&nbsp; Account Settings</Link>
                            </li>
                            <li>
                                <span  role="button" className="text-dark" onClick={handleClick}><FaPowerOff />&nbsp; Logout</span>
                          </li>
                            <li>
                                <Link to={`/profile/${user?.user.username}`} className="text-decoration-none text-dark"><FaUser />&nbsp; Profile Page</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    )
}