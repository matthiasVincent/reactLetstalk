import { host_port } from "../../services/AuthHeader"
import { Link } from "react-router-dom"

export function OnePostPicture({post}){
    const [one] = [...post?.post_pictures]

    return(
        <Link to={`/posts/${post.post_id}/photos?target=${one.id}`} className='row' style={{overflowX: 'hidden'}}>
            <div className="col">
                <img src={`http://${window.location.hostname}:${host_port}${one.image}`} alt="" width="100%" height="100%" />
            </div>
        </Link>
    )
}