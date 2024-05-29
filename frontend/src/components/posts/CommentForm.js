import { FaFileImage } from "react-icons/fa"
import { FaPaperPlane } from "react-icons/fa"
import { useState, useRef, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"
import './styles/Comment.css'
import { host_port } from "../services/AuthHeader"
import axios from "axios"


export function TypeMessage({name, post_id, inputRef, postRef}){
    const[focus, setFocus] = useState(false)
    const [comment, setComment] = useState('')
    const {user, setPosts} = useContext(AuthContext)
    // const textInputRef = useRef(null)
    
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
 
    useEffect(resizeTextArea, [comment])


    const handleChange = (e) => {
        setComment(e.target.value)
        postRef.current.style.marginBottom = "auto"
        if (e.target.scrollHeight <= 150){
            postRef.current.style.marginBottom = (e.target.scrollHeight - 30) + "px"
            window?.scrollTo(0, postRef.current?.scrollHeight)
        }
        else{
            postRef.current.style.marginBottom = "110px"
            window?.scrollTo(0, postRef.current?.scrollHeight)
        }
        console.log(postRef.current?.scrollHeight - e.target.scrollHeight, postRef.current.style.marginBottom)
    }

    function handleSend(e) {
        e.preventDefault()
        if (comment === ''){
            console.log("Type something")
            return
        }
        const formD = new FormData(e.target)
        const config = {
            params: {
                username: user?.user.username
            }
        }
        axios.post(`http://${window.location.hostname}:${host_port}/api/v1/posts/${post_id}/comment/`, formD, config).then(
            (response) => {
                setPosts((prev) => {
                    const newPosts = prev.map((post) => {
                        if (post.post_id === post_id){
                            return {
                                ...post,
                                comments: [...post.comments, response.data],
                                all_comments: post.all_comments + 1
                            }
                        }
                        else{
                            return post
                        }
                    })
                    return newPosts
                })
                console.log(response)
            }
        ).catch(err => {
            console.log(err)
        })
       
        setComment('')
    }

    return(
        <>
            <form onSubmit={handleSend} className={name}>
                <label htmlFor="lbl" className={`${focus? 'd-none' : 'd-block'}`}>
                    <FaFileImage className="text-primary icons" />
                </label>
                <input type="file" className="d-none" id="lbl" name="pic-message" />
                <textarea  rows="1" className="w-100 mr-2 p-2" placeholder="Type a comment"
                    style={{resize: 'none', display: 'inline-block', overflowY: 'hidden', borderRadius: '25px'}} 
                    name="comment"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={comment}
                    ref={inputRef}
                    required></textarea>

                <input type="hidden" name="commenter" value={user?.user.username} />

                <button type="submit"  style={{borderRadius: '50%'}}><FaPaperPlane className="text-primary icons" /></button>
            </form>
        </>
    )
}
