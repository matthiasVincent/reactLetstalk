import { Navbar } from "./Navbar";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import { useEffect } from "react";
import axios from "axios";
import { FriendRequest } from "./UserSuggestions";
import { FollowUser } from "./UserSuggestions";
import { host_port } from "./services/AuthHeader";

export function Friends(){
    const{user, toFollow, activeStatus, setActiveStatus, confirm, setConfirm, confirmDone, setConfirmDone} = useContext(AuthContext)

    useEffect(() => {
        setActiveStatus((prev) => ({...prev, home: '', friends: 'active', buddy: ''}))
    }, [setActiveStatus])

    useEffect(() =>{
        async function getFriendRequests(){
            const config = {
                params: {
                    username: user?.user.username
                }
            }
            try {
                const response = await axios.get(`http://${window.location.hostname}:${host_port}/api/v1/user/friend_request/`, config)
                //console.log(response.data)
                setConfirm(response.data)
            }
            catch (err){
                console.log(err)
            }
        }
        if (!confirmDone){
            getFriendRequests();
            setConfirmDone(!confirmDone)
        }
    }, [confirmDone, setConfirm, setConfirmDone, user?.user.username])

    return(
        <>
        <Navbar activeStatus={activeStatus}/>
        <section className="friend-request" id="friend-request">
            <div className="row row-friend">
                <div className="col-sm-6 mb-3">
                    <div className="container m-0  f p-3 bg-light" id="follower-request">
                        <p className="h6"  style={{fontSize: '20px',  fontWeight: 500}}>Friend Request</p>
                        {
                            confirm && (
                                confirm.map((request) => {
                                    return <FriendRequest user={request} logged_in={user} key={request.id_user} />
                                })
                            )
                        }
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="container m-0  f p-3 bg-light" id="request_suggestion">
                        <p className="h6" style={{fontSize: '20px',  fontWeight: 500}}>Users you can follow</p>
                        {
                            toFollow && (
                                    toFollow.map((follow) => {
                                        return <FollowUser user={follow} logged_in={user} key={follow.id_user} btn_id={follow.id_user} />
                                    })
                            )
                        }
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}