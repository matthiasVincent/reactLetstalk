import { useState, createContext } from "react";
import { AuthService } from "../services/AuthService";

const Auth = new AuthService()

export const AuthContext = createContext("")

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(() => Auth.getCurrentUser())
    const [flag, setFlag] = useState(false)
    const [posts, setPosts] = useState([])
    const [toFollow, setToFollow] = useState([])
    const [activeStatus, setActiveStatus] = useState({home: 'active', friends: '', buddy: ''})
    const [btnText, setBtnText] = useState({})
    const [confirm, setConfirm] = useState([])
    const [confirmDone, setConfirmDone] = useState(false)
    const [accepted, setAccepted] = useState([])
    return (
        <AuthContext.Provider 
         value={
            {
                user,
                setUser,
                posts,
                setPosts,
                flag,
                setFlag,
                toFollow,
                setToFollow,
                activeStatus,
                setActiveStatus,
                btnText,
                setBtnText,
                confirm,
                setConfirm,
                confirmDone,
                setConfirmDone,
                accepted,
                setAccepted,
            }
            }>
            {children}
        </AuthContext.Provider>
            
            )
}