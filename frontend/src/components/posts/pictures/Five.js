import { host_port } from "../../services/AuthHeader"
import { Link } from "react-router-dom"
export function FivePostPictures({post}){
    const [one, two, three, four, five] = [...post?.post_pictures]

    return(
        <div className="container-fluid p-0" style={{overflowX: 'hidden'}}>
            <div className="row p-0">
                <Link to={`/posts/${post.post_id}/photos?target=${one.id}`} className="col p-0">
                    <img src={`http://${window.location.hostname}:${host_port}${one.image}`} alt="" style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover'}} />
                </Link>
                <Link to={`/posts/${post.post_id}/photos?target=${two.id}`} className="col p-0">
                    <img src={`http://${window.location.hostname}:${host_port}${two.image}`} alt="" style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover'}} />
                </Link>
            </div>
            <div className="row">
                <Link to={`/posts/${post.post_id}/photos?target=${three.id}`} className="col p-0">
                    <img src={`http://${window.location.hostname}:${host_port}${three.image}`} alt="" style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover'}} />
                </Link>
                <Link to={`/posts/${post.post_id}/photos?target=${four.id}`} className="col p-0">
                    <img src={`http://${window.location.hostname}:${host_port}${four.image}`} alt="" style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover'}} />
                </Link>
                <Link to={`/posts/${post.post_id}/photos?target=${five.id}`} className="col p-0">
                    <img src={`http://${window.location.hostname}:${host_port}${five.image}`} alt=""style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover'}} />
                </Link>
            </div>
        </div>
    )
}