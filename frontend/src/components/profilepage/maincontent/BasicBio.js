import { ProfileContext } from "../../context/ProfileContext"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { host_port } from "../../services/AuthHeader"

export default function ProfilePhoto(){
    const {profile} = useContext(ProfileContext)
    const {user} = useContext(AuthContext)

    return(
        <div className="prp">
            {
                profile &&
                (
                    user?.user.username === profile.data.username? (
                        <>
                            <Toggler  data_target="#m" profile={profile}/>
                            <Modal />
                        </>
                    )
                    :
                    <Toggler data_target='#' profile={profile}/>
                )
            }
        </div>
    )

}

function Toggler({data_target, profile}){
    return(
        <div role="button" data-toggle="modal" data-target={data_target} style={{height: '100%', width: '100%', borderRadius: '50%'}} className="m-0 p-0 bg-success">
            <img src={`http://${window.location.hostname}:${host_port}${profile.data.profile_image}`} alt="" className="w-100 h-100" style={{borderRadius: '50%', objectFit: 'cover'}} />
        </div>
    )
}

function Modal(){
    return (
        <div className="modal fade" id="m">
            <div className="modal-dialog fixed-bottom">
                <div className="modal-content">
                    <div className="modal-header table-dark">
                        <h5 className="modal-title">Hey guys</h5>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body table-dark">
                        <ul className="container">
                            <li className="dropdown-item">
                                <Link to="#">
                                    Change profile pricture 
                                </Link>
                            </li>
                            <div className="dropdown-divider"></div>
                            <li className="dropdown-item">
                                <Link to="#">
                                    View profile pricture
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="modal-footer table-dark">
                        <button type="button" className="btn btn-danger" data-dismiss="modal">close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}