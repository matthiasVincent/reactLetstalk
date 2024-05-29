import { host_port } from "../../services/AuthHeader"
import { Link } from "react-router-dom"

export function ThreePostPictures({post}){
    const [one, two, three] = [...post?.post_pictures]

    return(
        <div className="container-fluid" style={{overflowX: 'hidden'}}>
            <div className="p-0 m-0" style={{height: '300px', display: 'flex'}}>
                <Link to={`/posts/${post.post_id}/photos?target=${one.id}`} className="table-primary p-0 m-0" style={{height: '100%', width: '60%'}}>
                    <img src={`http://${window.location.hostname}:${host_port}${one.image}`} alt="" style={{width:"100%", height:"100%", objectFit: 'cover'}} />
                </Link>
                <div className="table-danger p-0 m-0" style={{width: '40%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Link to={`/posts/${post.post_id}/photos?target=${two.id}`} style={{width: '100%', height: '100%'}}>
                        <img src={`http://${window.location.hostname}:${host_port}${two.image}`} alt="" style={{width: '100%', height: '50%', objectFit: 'cover'}}/>
                    </Link> 
                    <Link to={`/posts/${post.post_id}/photos?target=${three.id}`} style={{width: '100%', height: '100%'}}>
                        <img src={`http://${window.location.hostname}:${host_port}${three.image}`} alt="" style={{width: '100%', height: '50%', objectFit: 'cover'}} />
                    </Link>      
                </div>
            </div>
        </div>
    )
}