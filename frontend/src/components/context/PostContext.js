import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import { host_port } from "../services/AuthHeader";

export const PostContext = createContext('')

export default function PostContextProvider({children}){
    const [posts, setPosts] = useState([])
    const {user} = useContext(AuthContext)
    console.log(posts)

    useEffect(() =>{
        async function getPosts(){
            const response = await axios.get(`http://${window.location.hostname}:${host_port}/api/v1/random_posts/`)
            //console.log(response.data)
            setPosts(response.data)
        }
        getPosts();
    }, [user])

    return (
        <PostContext.Provider value={{posts, setPosts}}>
            {children}
        </PostContext.Provider>
    )
}