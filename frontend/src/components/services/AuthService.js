import axios from "axios"
import { host_port } from "./AuthHeader"

export class AuthService {
    setUserInLocalStorage(data) {
        localStorage.setItem('user', JSON.stringify(data))
    }

    async login(username, password){
        axios.defaults.xsrfCookieName='csrftoken'
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
        axios.defaults.withCredentials = true
        const header = {
            "X-CSRFTOKEN": document.cookie.split("=")[1],
        }
        const config = {
            headers: header,
        }
        const response = await axios.post(`http://${window.location.hostname}:${host_port}/auth-token/`, {username, password}, config);
        //const response = await axios.post("https://Letstalk.pythonanywhere.com/auth-token/", {username, password}, config )
        if (!response.data.token){
            return response.data
        }
        this.setUserInLocalStorage(response.data)
        return response.data
    }

    logout(){
        localStorage.removeItem("user")
    }

    getCurrentUser() {
        const user = localStorage.getItem("user")
        return JSON.parse(user)
    }
}