import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import Post from "./posts/Posts";
import { AuthContext } from "./context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { host_port } from "./services/AuthHeader";
import { TypeMessage } from "./posts/CommentForm";
import { PostComments } from "./posts/Comments";


function Header({post, onHandleNavigate}){
    return (
        <div className="container-fluid d-flex bg-light align-items-center p-2 fixed-top" style={{borderBottom: '1px solid gray', zIndex: 100}}>
            <ul className="d-flex align-items-center justify-content-between p-2 m-0 w-100" style={{listStyle: 'none'}}>
                <li>
                    <div role="button" onClick={onHandleNavigate} className="h6 text-dark">
                        <FaArrowLeft />
                    </div>
                </li>
                <li>
                    <h6>{post.poster.first_name + " " + post.poster.last_name}</h6>
                </li>
                <li>
                <Link to='#' className="h6 text-dark text-decoration-none">
                        <FaSearch />
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default function SinglePost(){
   const {user, posts} = useContext(AuthContext)
   const {post_id} = useParams()
   const [post, setPost] = useState('')
   //const [allComments, setComments] = useState('')
   const postRef = useRef(null)
   const inputRef = useRef(null)

   const extract_post = (p, i) => {
    const s = p.filter(p => p.post_id === i)
    return s
   }

   console.log(extract_post(posts, post_id))

   //console.log(posts)

   const [single] = [...extract_post(posts, post_id)]
   console.log(single)
   const navigate = useNavigate();

   useEffect(() =>{

    async function getPost(){
        try{
            const response = await axios.get(`http://${window.location.hostname}:${host_port}/api/v1/posts/${post_id}/`)
            setPost(response.data)
            //setComments(response.data.comments)
            console.log(response.data)
        }
        catch(err){
            console.log(err)
        }
    }

    getPost();
   
   }, [post_id])
   const handleNavigate = () => navigate(-1)

   useEffect(() => {

    window?.scrollTo(0, postRef.current?.scrollHeight)

   }, [single.comments, inputRef.current?.scrollHeight])

    return (
        <>
            {
                single && (
                    <div ref={postRef}>
                        < Header post={single} onHandleNavigate={handleNavigate} />
                        <div className="wrapper p-0" style={{marginTop: '70px', position: 'relative'}}>
                            <div className="p-0 mb-2" style={{borderBottom: '1px solid gray'}}>
                                <Post post={single} pictures_length={single.post_pictures.length} user={user} />
                            </div>
                            <div className="post-comments" style={{marginBottom: '70px'}}>
                                <PostComments comments={single.comments} post_id={post_id}/>
                            </div>
                            <TypeMessage name="comment-send"  post_id={post_id} inputRef={inputRef} postRef={postRef}/>
                        </div>
                    </div>
                )
            }
                    
        </>
    )
}