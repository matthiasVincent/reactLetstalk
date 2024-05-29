import { host_port } from "./services/AuthHeader"
import { Link } from "react-router-dom"
import { GenRxn } from "./GenRxn"

export function SinglePhoto({image}){
    const [one] = [...image]

    return(
        <>
        <Link  className='row pb-2 mb-2' style={{overflowX: 'hidden'}}>
            <div className="col" id={one.id}>
                <img src={`http://${window.location.hostname}:${host_port}${one.image}`} alt="" width="100%" height="100%" />
            </div>
            <hr />
        </Link>
        <GenRxn/>
        </>
    )
}