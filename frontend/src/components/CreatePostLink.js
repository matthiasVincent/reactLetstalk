import { Link } from "react-router-dom"
import { FaFileImage } from "react-icons/fa"
import { host_port } from "./services/AuthHeader"

export function CreatePostLink({profile, logged_in, isProfilePage}){
    return(
        <>
            {
                isProfilePage?
                (
                    <>
                         {
                            profile && (
                                profile.data.username === logged_in?.user.username ? (

                                    <div className="mb-2 p-2 pb-4" style={{backgroundColor: 'white'}}>
                                        <h3>Post</h3>
                                        <Link to='/createpost' className="d-flex align-items-center p-2 text-decoration-none"
                                        style={{border: 'solid 1.5px darkblue', borderRadius: '30px', margin: '0 auto'}}
                                    >
                                            <div className="link-info">
                                                <div style={{width: '60px', aspectRatio: '1/1', borderRadius: '50%'}}>
                                                    <img src={`http://${window.location.hostname}:${host_port}${profile.data.profile_image}`} alt="hi" style={{width: '100%', height: '100%', borderRadius: '50%'}}/>
                                                </div>
                                                <div className="post-link mx-2 p-2 w-100 ml-4" style={{borderRadius: '20px', backgroundColor: 'whitesmoke'}}>
                                                    <p className="m-0 p-0">What is on your mind ?</p>
                                                </div>
                                                <div className="some">
                                                    <FaFileImage className="text-dark" style={{fontSize: '25px'}} />
                                                </div>
                                            </div>
                                    </Link>
                                    </div>
                            )
                            :
                            ''
                            )
            }

                    </>
                )
                :
                (
                   <>
                        {
                            logged_in && (
                                <Link to='/createpost' className="post-page d-flex align-items-center p-2 text-decoration-none w-100"
                                        style={{border: 'solid 1.5px darkblue', borderRadius: '30px', margin: '0 auto'}}
                                    >
                                            <div className="link-info">
                                                <div style={{width: '60px', aspectRatio: '1/1', borderRadius: '50%'}}>
                                                    <img src={`http://${window.location.hostname}:${host_port}${logged_in.user.profile_image}`} alt="hi" style={{width: '100%', height: '100%', borderRadius: '50%'}}/>
                                                </div>
                                                <div className="post-link mx-2 p-2 w-100" style={{borderRadius: '20px', backgroundColor: 'whitesmoke'}}>
                                                    <p className="m-0 p-0">What is on your mind ?</p>
                                                </div>
                                                <div className="some">
                                                    <FaFileImage className="text-dark" style={{fontSize: '25px'}} />
                                                </div>
                                            </div>
                                    </Link>
                            )
                        }
                   </>
                )
            }
        </>
    )
}