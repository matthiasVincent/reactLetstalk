import { ProfileContent } from "./maincontent/ProfileContent";
import { ProfileWrapper } from "./maincontent/Basic";
import { Header } from "./headers/Headers";
import { useParams } from "react-router-dom";
import { ProfileContext } from "../context/ProfileContext";
import { useContext } from "react";
import { useEffect } from "react";
import axios from "axios";
import { host_port } from "../services/AuthHeader";

export default function ProfilePage(){
    const {profile, setProfile} = useContext(ProfileContext)
    const {username} = useParams()
    console.log(profile)

    useEffect(() =>{
        async function getProfile(){
            const response = await axios.get(`http://${window.location.hostname}:${host_port}/profile/${username}/`)
            console.log(response.data)
            setProfile(response.data)
        }
        getProfile();
    }, [username, setProfile])
    return(
        <>
            <Header />
            <div className="container-fluid p-0">
                <ProfileWrapper />
                <ProfileContent />
            </div>
        </>
    )
}