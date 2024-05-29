import { host_port } from "../services/AuthHeader";
import { useState } from "react";
import { FormatPostDate } from "../FormatDate";
import { Link } from "react-router-dom";
import { formatNewLine } from "../Utils";


export function PostComments({comments, post_id}){
    return(
        <div className="post-comments">
            {
                comments?.map((comment) => < Comment comment={comment} key={comment.comment_id} post_id={post_id}/>)
            }
        </div>
    )
}


function Comment({comment, post_id}){
    const fullname = `${comment.user.first_name} ${comment.user.last_name}`
    return (
        comment?.replies.length ?
        (
            comment?.replies.length > 2 ?
            (
                <>
                    <div className="only-comment mt-2 d-flex pl-3">
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
                                <Link to={`comments/${comment.comment_id}/replies`} className="text-decoration-none ml-2 text-dark">reply</Link>
                            </div>
                        </div>
                    </div>
                    <Link to={`comments/${comment.comment_id}/replies`} className="text-decoration-none text-dark" style={{display: 'inline-block', marginLeft: '50px'}}>
                        <p class="h5 p-2">View more replies...</p>
                        {
                             comment?.replies.slice(0,2).map(reply => <RepliesMoreThanTwo comment_id={comment.comment_id} reply={reply} key={reply.comment_id}  />)
                        }
                    </Link>
                </>
            )
            :
            (
                <>
                    <div className="only-comment mt-2 d-flex pl-3">
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
                                <Link to={`comments/${comment.comment_id}/replies`} className="text-decoration-none ml-2 text-dark">reply</Link>
                            </div>
                        </div>
                    </div>
                    {
                    comment?.replies.map(reply => <RepliesAtMostTwo comment_id={comment.comment_id} reply={reply} key={reply.comment_id}  />)
                    }
                </>
            )
        )

        : 
        (
            !comment.reply?
        (
            <div className="only-comment mt-2 d-flex pl-3">
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
                        <Link to={`comments/${comment.comment_id}/replies`} className="text-decoration-none ml-2 text-dark">reply</Link>
                    </div>
                </div>
            </div>
        )
        :
        ''
    )

    )
}


function RepliesMoreThanTwo({reply, comment_id}){
    const fullname = `${reply.user.first_name} ${reply.user.last_name}`

    return (
            <div>
                <div className="short">
                    <div className="img-top">
                        <img src={`http://${window.location.hostname}:${host_port}${reply.user.profile_image}`} alt="" className="image" />
                    </div>
    
                    <div className="reply-txt p-2 mb-0">
                        <p><span className="mr-2"><b>{fullname.slice(0, 12) + "..."}</b></span>{reply.comments.slice(0, 13) + "..."}</p>
                    </div>
                </div>
            </div>
    )
}

function RepliesAtMostTwo({reply, comment_id}){
    const fullname = `${reply.user.first_name} ${reply.user.last_name}`
    
    return(
        <Link to={`comments/${comment_id}/replies`} className="text-decoration-none text-dark mb-1" style={{display: 'inline-block', marginLeft: '50px'}}>
            <div>
                <div className="short">
                    <div className="img-top">
                        <img src={`http://${window.location.hostname}:${host_port}${reply.user.profile_image}`} alt="" className="image" />
                    </div>

                    <div className="reply-txt ml-3">
                        <p><span className="mr-2"><b>{fullname.slice(0, 12) + "..."}</b></span>{reply.comments.slice(0, 13) + "..."}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}