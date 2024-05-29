 import { Link } from "react-router-dom"
 import { FaThumbsUp } from "react-icons/fa"
 import { FaComment } from "react-icons/fa"
 import { useState } from "react"
 import axios from "axios";
 import { host_port } from "../services/AuthHeader";

function Ilike(user, likers){
    for (let like of likers){
        if (user===like){
            return true
        }
    }
    return false
}



export function PostRxn({post, user}){
    const [postLikes, setPostLikes] = useState(post.all_likes)
    const likesCount = post.all_likes
    const [likeStatus, setLikeStatus] = useState(Ilike(user?.user.username, post?.all_likers))
    console.log(postLikes)
    const post_id = post?.post_id

   async function likepost()
   {
    const config = {
        params: {
            username: user?.user.username
        }
    }
    const response = await axios.get(`http://${window.location.hostname}:${host_port}/api/v1/posts/${post_id}/like/`, config)
    return response.data
   }

   async function handleLike(){
    try {
        const response = await likepost()
        if (response.like){
            setLikeStatus((prev) => !prev)
            setPostLikes((prev) => prev + 1)
            console.log(response)
        }
        else{
            setLikeStatus((prev) => !prev)
            setPostLikes((prev) => prev - 1)
            console.log(response)
        }
    }
    catch(err){
        console.log(err)
    }
   }
    

    return(
        <div className="rxn p-3">
            <div className="d-flex flex-column">
                    {
                    postLikes && likeStatus? 
                    
                        <p style={{color: 'green'}}>You
                            <span>{postLikes - 1 > 1 ? ` and ${postLikes - 1 + "  others"}` : `${postLikes - 1 === 0 ?  " liked this" : ` and ${postLikes - 1 + " other"}`}`}</span>
                        </p>
                    
                    :
                        <p>
                            <span
                                style={{color:'green'}}>{postLikes  > 1 ? `${postLikes + " likes"}` : `${postLikes === 0? "" : `${postLikes + " like"}`}`} 
                            </span>
                        </p>
                    }
            </div>
            <div className="d-flex p-2 justify-content-between">
                    {
                    postLikes && likeStatus? 
                    
                    <div className="p-2"
                        style={{backgroundColor: 'beige', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <FaThumbsUp className="text-primary m-0" aria-hidden="true" onClick={handleLike}  style={{cursor: 'pointer'}} />
                        <span className="ml-2 text-dark">{postLikes}</span>
                    </div>
                    :
                    <div className="p-2"
                        style={{backgroundColor: 'beige', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <FaThumbsUp className="text-dark m-0" aria-hidden="true" onClick={handleLike} style={{cursor: 'pointer'}}/>
                        <span className="ml-2 text-dark">{postLikes}</span>
                    </div>
                    }

        
                <div className="d-flex align-items-center">
                    <Link to={`/posts/${post.post_id}`} className="text-decoration-none p-2" style={{backgroundColor: 'beige', borderRadius: '5px'}}>
                        <FaComment className="text-secondary" />
                        <span className="ml-2 text-dark">{post.all_comments}</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}