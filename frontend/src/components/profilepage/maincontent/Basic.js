import Banner from "./Banner";
import ProfilePhoto from "./BasicBio";

export function ProfileWrapper(){
    return(
        <div className="photo-cont d-flex align-items-center mb-2">
            <Banner />
            <ProfilePhoto />
        </div>
    )
}