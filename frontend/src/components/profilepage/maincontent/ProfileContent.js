import BioDm from "./BioDm";
import PostWrapper from "./PostInfo";

export function ProfileContent(){
    return(
        <div className="profile-contents" style={{marginTop: '-20px', backgroundColor: 'lightgrey'}}>
            <BioDm />
            <PostWrapper />
        </div>
    )
}