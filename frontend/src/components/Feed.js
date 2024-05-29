import { useEffect } from "react";
import axios from "axios";
import { useContext, useState} from "react";
import Post from "./posts/Posts";
import { Navbar } from "./Navbar";
import { AuthContext } from "./context/AuthContext";
import { CreatePostLink } from "./CreatePostLink";
import { UserToFollow } from "./UserSuggestions";
import { host_port } from "./services/AuthHeader";
import { Loader } from "../Loader";
import { returnPostsFormatted } from "./Utils";

export function Feed(){
    const {posts, setPosts, toFollow, flag, setFlag, setToFollow, activeStatus, setActiveStatus} = useContext(AuthContext)
    const {user} = useContext(AuthContext)
    const [fetching, setFetching] = useState(false)
   

    useEffect(() => {
        //window.scrollTo(0, 0)
        setActiveStatus((prev) => ({...prev, home: 'active', friends: '', buddy: ''}))
    }, [setActiveStatus])

    useEffect(() =>{
        async function getPostsUsers(){
            // const response = await axios.get("https://Letstalk.pythonanywhere.com/api/v1/random_posts/")
            const config = {
                params: {
                    username: user?.user.username
                }
            }
            try {
                setFetching(true)
                const responsePosts = axios.get(`http://${window.location.hostname}:${host_port}/api/v1/random_posts/`)
                const responseUsers = axios.get(`http://${window.location.hostname}:${host_port}/api/v1/user/friend_suggestion`, config)
                const [postResponse, userResponse] = await Promise.all([responsePosts, responseUsers])

                setPosts(postResponse.data)
                console.log(returnPostsFormatted(postResponse.data))
                setToFollow(userResponse.data)
                setFetching(false)

            }
            catch (err){
                console.log(err)
                setFetching(false)
            }
        }
        if (!flag)
        {
        getPostsUsers();
        setFlag(!flag)
        }
        return;
    }, [flag, setFlag, setPosts, setToFollow, user?.user.username])

    // useEffect(() =>{
    //     async function getUsers(){
    //         const config = {
    //             params: {
    //                 username: user?.user.username
    //             }
    //         }
    //         try {
    //             // const response = await axios.get("https://Letstalk.pythonanywhere.com/api/v1/user/friend_suggestion", config)
    //             const response = await axios.get(`http://${window.location.hostname}:${host_port}/api/v1/user/friend_suggestion`, config)
    //             //console.log(response.data)
    //             setToFollow(response.data)
    //         }
            
    //         catch (err){
    //             console.log(err)
    //         }
    //     }
    //     if (!flag){
    //         getUsers();
    //         setFlag(!flag)
    //     }
    // }, [flag, setFlag, setToFollow, user?.user.username])

    return (
        <>
            <Navbar activeStatus={activeStatus} />
            <div className="ld-cont" style={{display: fetching? 'block':'none', height: '90vh', overflowY: 'hidden'}}><Loader /></div>
            <section className="home" id="home">
                <div className="home-wrapper p-2">
                    <CreatePostLink logged_in={user} isProfilePage={false}/>
                    <div className="row">
                        <div className="col-lg-4 col-md-5 p-3 col-sm-6">
                            <div className="api-cont">
                            {
                                posts.map((post) => {
                                    return(
                                        <Post post={post} key={post.post_id} pictures_length={post.post_pictures.length} user={user} />
                                    )
                                })
                            }
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-7  p-3 col-sm-6">
                            <div className="container m-0  f p-3 bg-light" id="user_suggestion">
                                <p className="h6">Users you can follow</p>
                                        {/* <!-- Fetch through Ajax Api --> */}
                                    {
                                        toFollow && (
                                                toFollow.map((user) => {
                                                    return <UserToFollow user={user} key={user.id_user} />
                                                })
                                        )
                                    }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    </>
    )
}
