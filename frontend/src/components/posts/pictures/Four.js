import { host_port } from "../../services/AuthHeader"
import { Link } from "react-router-dom"

export function FourPostPictures({post}){
    const [one, two, three, four] = [...post?.post_pictures]

    return(
        <div className="container-fluid bg-info  m-0 p-0" style={{overflowX: 'hidden'}}>
            <div className="d-flex m-0 p-0">
                <Link to={`/posts/${post.post_id}/photos?target=${one.id}`} className="col-8  table-primary p-0 m-0"> 
                    <img src={`http://${window.location.hostname}:${host_port}${one.image}`} alt="" style={{width: "100%", height: '100%'}} />
                </Link>
                <div className="col-4  table-danger p-0 m-0" style={{display:'grid', gridTemplateRows: 'repeat(3, 1fr)'}}>
                    <Link to={`/posts/${post.post_id}/photos?target=${two.id}`} className="m-0">
                        <img src={`http://${window.location.hostname}:${host_port}${two.image}`} alt="Second pics" style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover'}} />
                    </Link>
                    <Link to={`/posts/${post.post_id}/photos?target=${three.id}`} className="m-0" style={{height: '100%'}}>
                        <img src={`http://${window.location.hostname}:${host_port}${three.image}`} alt="Third pics"  style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover'}}/>
                    </Link>
                    <Link to={`/posts/${post.post_id}/photos?target=${four.id}`} className="m-0" style={{height: '100%'}}> 
                        <img src={`http://${window.location.hostname}:${host_port}${four.image}`} alt="Fourth pics" style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover'}}/>
                    </Link>
                </div>
            </div>
        </div>
    )
}