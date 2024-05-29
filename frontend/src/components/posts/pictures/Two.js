import { host_port } from "../../services/AuthHeader"
import { Link } from "react-router-dom"

export function TwoPostPictures({post}){
    const [one, two] = [...post?.post_pictures]

    return(
        <div className='row p-0 m-0' style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', overflowX: 'hidden'}}>
            <Link to={`/posts/${post.post_id}/photos?target=${one.id}`} className="col p-0">
                <img src={`http://${window.location.hostname}:${host_port}${one.image}`} alt="" width="100%" height="100%" />
            </Link>
            <Link to={`/posts/${post.post_id}/photos?target=${two.id}`} className="col p-0">
                <img src={`http://${window.location.hostname}:${host_port}${two.image}`} alt="" width="100%" height="100%" />
            </Link>
        </div>
    )
}