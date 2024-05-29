import { FaCheck } from "react-icons/fa"

export function OtherUserSeen({image_url}){
    return(
        <div className="read-notify" style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%'
        }}>
            <img src={image_url}  style={{width: '100%', height: '100%', borderRadius: '50%'}}/>
        </div>
    )
}

export function Sent(){
    return(
        <div className="read-notify bg-secondary" style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: '10px',
        }}>
            <FaCheck />
        </div>
    )
}