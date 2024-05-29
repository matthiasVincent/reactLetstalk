import { Link } from "react-router-dom";
import { FaEllipsisH } from "react-icons/fa";
import { FormatPostDate } from "../FormatDate";
import { host_port } from "../services/AuthHeader";

export function PostHeader({post}){
    console.log(FormatPostDate(post.created))

    const format = FormatPostDate(post.created)
    const fullname = `${post.poster.first_name} ${post.poster.last_name}`

    return(
        <div className="d-flex justify-content-between mb-2 p-2" >
            <Link to={`/profile/${post.poster.username}`} className="text-decoration-none text-dark pl-0">
                <div className="lf">
                    <div className="img-cont m-0">
                        <img src={`http://${window.location.hostname}:${host_port}${post.poster.profile_image}`} alt="hi" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                    </div>
                    <div className="ml-4 d-flex flex-column">
                        <span className="h5 text-dark">{fullname.length > 12 ? fullname.slice(0, 12) + "..." : fullname}</span>
                        <span className="ml-2">
                            <span><code className="text-dark">{format} &nbsp;</code></span>
                            {
                                post.followers && (
                                    <small>{post.poster.followers && post.poster.followers > 1? post.poster.followers + " followers"
                                    : 
                                   post.poster.followers < 1?  "" : post.poster.followers + " follower"}</small>
                                )
                            }
                        </span>
                    </div>
                </div>
            </Link>
            <p>
                <Link to="#" className="text-decoration-none" style={{fontSize: '20px', fontWeight: 600, marginRight: '20px'}}>
                    <FaEllipsisH className="text-dark" />
                </Link>
            </p>
        </div>
    )
}