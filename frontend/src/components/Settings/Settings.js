import { CoverImage } from "./Photos/CoverImage";
import { ProfileImage } from "./Photos/ProfileImage";
import { PersonalDetails } from "./Biodata/PersonalDetails";
import { BreadCrumb } from "./Headers/BreadCrumb";
import { MainHeader } from "./Headers/MainHeader";
import { useNavigate } from "react-router-dom";

export default function Settings(props){
    const navigate = useNavigate();

    const handleNavigate = () => navigate(-1)

    return(
        <>
            <MainHeader onHandleNavigate={handleNavigate}/>
            <div className="container-fluid p-0">
                <div className="bio-wrapper">
                    <BreadCrumb />
                    <div className="user-basics">
                        <CoverImage />
                        <ProfileImage />
                        <PersonalDetails />
                    </div>
                </div>
            </div>
        </>
    )
}