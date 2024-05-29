import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"
import { AuthContext } from "./context/AuthContext"
import { useContext, useRef , useEffect} from "react"
import { useState } from "react"
import { FaFileImage } from "react-icons/fa"
import { FaPaperPlane } from "react-icons/fa"
import { host_port } from "./services/AuthHeader"
import axios from "axios"
import { FormatPostDate } from "./FormatDate"




function Header({onHandleNavigate}){
    return (
        <div className="container-fluid d-flex bg-light align-items-center p-2 fixed-top" style={{borderBottom: '1px solid gray', zIndex: 100}}>
            <ul className="d-flex align-items-center justify-content-between p-2 m-0 w-100" style={{listStyle: 'none'}}>
                <li>
                    <div role="button" onClick={onHandleNavigate} className="h6 text-dark">
                        <FaArrowLeft />
                    </div>
                </li>
                <li>
                    <h6>replies</h6>
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

function TypeReply({name, inputRef, postRef,  comment_id, post_id, onSetReplies}){
    const[focus, setFocus] = useState(false)
    const [reply, setReply] = useState('')
    const {user} = useContext(AuthContext)
   
    const handleFocus = () =>{
        setFocus(true)
    }

    const handleBlur = () => {
        setFocus(false)
    }

    const resizeTextArea = () => {
        inputRef.current.style.height = 'auto'
        inputRef.current.style.maxHeight = 150 + "px"
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
    }
 
    useEffect(resizeTextArea, [reply])


    const handleChange = (e) => {
        setReply(e.target.value)
        postRef.current.style.marginBottom = "auto"
        if (e.target.scrollHeight <= 150){
            postRef.current.style.marginBottom = (e.target.scrollHeight + 30) + "px"
            window?.scrollTo(0, postRef.current?.scrollHeight)
        }
        else{
            postRef.current.style.marginBottom = "auto"
            window?.scrollTo(0, postRef.current?.scrollHeight)
        }
        console.log(postRef.current?.scrollHeight - e.target.scrollHeight, postRef.current.style.marginBottom)
    }

    function handleSend(e) {
        e.preventDefault()
        if (reply === ''){
            console.log("Type something")
            return
        }
        const formD = new FormData(e.target)
        // const config = {
        //     params: {
        //         username: user?.user.username
        //     }
        // }
        axios.post(`http://${window.location.hostname}:${host_port}/api/v1/posts/${post_id}/comments/${comment_id}/reply/`, formD).then(
            (response) => {
       
                console.log(response)
                onSetReplies((prev) => [...prev, response.data])
            }
        ).catch(err => {
            console.log(err)
        })
       
        setReply('')
    }

    return(
        <>
            <form onSubmit={handleSend} className={name}>
                <label htmlFor="lbl" className={`${focus? 'd-none' : 'd-block'}`}>
                    <FaFileImage className="text-primary icons" />
                </label>
                <input type="file" className="d-none" id="lbl" name="pic-message" />
                <textarea  rows="1" className="w-100 mr-2 p-2" placeholder="Type a reply"
                    style={{resize: 'none', display: 'inline-block', overflowY: 'hidden', borderRadius: '25px'}} 
                    name="reply"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={reply}
                    ref={inputRef}
                    required></textarea>

                <input type="hidden" name="username" value={user?.user.username} />

                <button type="submit"  style={{borderRadius: '50%'}}><FaPaperPlane className="text-primary icons" /></button>
            </form>
        </>
    )
}




export function Reply(){
    const {user, posts} = useContext(AuthContext)
    const {comment_id} = useParams()
    const {post_id} = useParams()
    const replyRef = useRef(null)
    const inputReplyRef = useRef(null)
    const [replies, setReplies] = useState([])

    // extract the post with this post_id from the posts
    const extract_post = (p, i) => {
        const s = p.filter(p => p.post_id === i)
        return s
       }
    
       const extract_comment = (c, i) => {
        const s = c.filter(p => p.comment_id=== i)
        return s
       }


    useEffect(() =>{

    async function getCommentReplies(){
        try{
            const response = await axios.get(`http://${window.location.hostname}:${host_port}/api/v1/posts/${post_id}/comments/${comment_id}/replies/`)
            setReplies(response.data)
            //setComments(response.data.comments)
            console.log(response.data)
        }
        catch(err){
            console.log(err)
        }
    }

    getCommentReplies();
    
    }, [comment_id])

    // destructuring the array to get this post
    const [single] = [...extract_post(posts, post_id)]
    const {comments} = single
    console.log(comments)

    // get single comment
    const [comment] = [...extract_comment(comments, comment_id)]
    const fullname = `${comment.user.first_name} ${comment.user.last_name}`
    console.log(comment)
    console.log(replies)
    const navigate = useNavigate()
    const handleNavigate = () => navigate(-1)

    useEffect(() => {

        window?.scrollTo(0, replyRef.current?.scrollHeight)
    
       }, [replies])
    
    return(
        <>
            <Header onHandleNavigate={handleNavigate} />
            <div className="wrapper p-0" style={{marginTop: '70px', position: 'relative', marginBottom: '80px'}} ref={replyRef}>
                <div className="only-comment mt-2 d-flex pl-3 mb-2">
                    <div className="img-comment" style={{width: '60px', height: '60px', borderRadius: '50%'}}>
                        <img src={`http://${window.location.hostname}:${host_port}${comment.user.profile_image}`} alt="" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                    </div>
                    <div className="ml-3 p-2" style={{width: '80%', borderRadius: '15px', backgroundColor: 'aliceblue'}}>
                        <div className="p-2">
                            <p className="p-0 m-0"><b>{fullname}</b></p>
                            <p className="m-0 p-0">{comment?.comments}</p>
                        </div>
                        <div className="p-2">
                            <span>{FormatPostDate(comment.created)}</span>
                            <Link to="#" className="text-decoration-none ml-2 text-dark">Like</Link>
                            <Link to='' className="text-decoration-none ml-2 text-dark">reply</Link>
                        </div>
                    </div>
                </div>
                    {
                        replies.map(reply => <CommentReplies comment={reply} key={reply.comment_id} />)
                        }
                 <TypeReply name='comment-send' postRef={replyRef} inputRef={inputReplyRef} post_id={post_id} comment_id={comment_id} onSetReplies={setReplies} />
            </div>
        </>
    )
}



function CommentReplies({comment}){
    const fullname = `${comment.user.first_name} ${comment.user.last_name}`
    return (
        <div className="short" style={{marginLeft: '50px', width: '100%'}}>
            <div className="img-reply" style={{width:'40px', height: '40px', borderRadius: '50%'}}>
                <img src={`http://${window.location.hostname}:${host_port}${comment.user.profile_image}`} alt="" className="image" style={{width:'100%', height: '100%', borderRadius: '50%'}} />
            </div>
            <div className="comment-reply p-3 mb-2 ml-3" style={{borderRadius: '15px', backgroundColor: 'whitesmoke', width: '70%'}}>
                <b><p>{fullname}</p></b>
                <p>{comment.comments}</p>
                <div className="some-reply p-0 pb-3" style={{marginTop: '5px'}}>
                    <span>{FormatPostDate(comment.created)}</span>
                    <Link to="#" className="text-decoration-none ml-2 text-dark">Like</Link>
                    <Link to='' className="text-decoration-none ml-2 text-dark">reply</Link>
                </div>
            </div>
        </div>
    )
}