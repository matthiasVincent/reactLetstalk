import { createContext, useState } from "react";



export const ProfileContext = createContext('')

export function ProfileContextProvider({children}){
    const [profile, setProfile] = useState('')

    return(
        <ProfileContext.Provider value={{profile, setProfile}}>
            {children}
        </ProfileContext.Provider>
    )
}