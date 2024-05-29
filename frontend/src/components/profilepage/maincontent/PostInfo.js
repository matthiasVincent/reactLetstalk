import { ProfileContext } from "../../context/ProfileContext"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { CreatePostLink } from "../../CreatePostLink"
import { useEffect, useState } from "react"
import Post from "../../posts/Posts"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
import { Photo } from "../../GenImage"
import { normalizeUrl } from "../../services/AuthHeader"
import { host_port } from "../../services/AuthHeader"

export default function PostWrapper(){
    const {profile} = useContext(ProfileContext)
    const {user} = useContext(AuthContext)
    const[userposts, setUserPosts] = useState([])
    const [userphotos, setPhotos] = useState([])
    const [friends, setFriends] = useState([])
    const [wit] = useState(0)
    const {username} = useParams()
    console.log(userphotos, friends)



    useEffect(() =>{
        async function getUserPosts(){
            const response = await axios.get(`http://${window.location.hostname}:${host_port}/api/v1/${username}/posts/`)
            //console.log(response.data)
            setUserPosts(response.data.data)
        }
        getUserPosts();
    }, [username])

    useEffect(() => {
        async function getPhotos(){
            const config = {
                params: {
                    username: username
                }
            }
            //const profile_pics = axios.get("http://127.0.0.1:8080/api/v1/profile_pictures/", config)
            const cover_pics = axios.get(`http://${window.location.hostname}:${host_port}/api/v1/cover_pictures/`, config)
            const friends = axios.get(`http://${window.location.hostname}:${host_port}/api/v1/user/buddy_list/`, config)

            const [coverPhotos, userFriends] = await Promise.all([cover_pics, friends])
            //console.log(profilePhotos, coverPhotos)
            //setPhotos(profilePhotos.data)
            setFriends(userFriends.data)
        }
        getPhotos()
    }, [username])
    

    return(
        <div className="row m-0  p-0">
            <div className="col-md-5 m-0 p-0 d-flex  p-md-3 flex-column pl-1 mb-2" style={{ backgroundColor: 'white'}}>
                {
                    userphotos && userphotos.length > 0? <ProfilePictures photos={userphotos} /> : ''
                }
                {
                    friends && friends.length > 0? <FriendList friends={friends} /> : ''
                }
            </div>
            <hr />
            <div className="col-md-6 col-lg-5 m-0 p-0 ml-lg-2 mt-lg-2">
                <CreatePostLink profile={profile} logged_in={user} isProfilePage={true}/>
                <div  style={{margin: '0 auto'}} id="user-posts">
                {
                        userposts && (
                                userposts.map((post) => {
                                    return(
                                        <Post post={post} key={post.post_id} pictures_length={post.post_pictures.length} user={user}/>
                                    )
                                 })
                            
                        )
                       }
                </div>
            </div>
        </div>
    )
}

function ProfilePictures({photos}){
    return (
        <div className="frd-cont p-1">
                <div className="d-flex flex-column py-2">
                <span className="h5 text-primary p-0">Profile Pictures</span>
                {/* <span className="h6">20 +</span> */}
                <div className="container p-0">
                    <div className="row m-0">
                        {
                            photos.slice(0, 3).map(photo => <Photo key={photo.id} url={normalizeUrl(photo.photo)} isFriend={false}/>)
                        }
                    </div>
                    <div className="row m-0">
                        {
                            photos.slice(3).map(photo => <Photo key={photo.id} url={normalizeUrl(photo.photo)}/>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

function FriendList({friends}){
    return(
        <div className="frd-cont p-1">
            <div className="d-flex flex-column py-2 m-0 mt-2">
                <p className="h4 p-0 text-primary">Friends</p>
                <p className="h5 p-0">20 +</p> 
            </div>
            <div className="container p-0">
                <div className="row m-0" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)'}}>
                    {
                        friends.map(friend => <Photo key={friend.id_user} url={`http://${window.location.hostname}:${host_port}${friend.profile_image}`} isFriend={true} info={friend}/>
                        )
                        
                    }
                </div>
            </div>
        </div>
    )
}
