import { Link } from "react-router-dom";

export default function LoginNav(props){
    return(
        <div className="container-fluid bg-dark login-nav">
           <h5>Letstalk</h5>
           <div className="sign-up">
                <Link to={"/" + props.route} element={props.element} style={{color: "white"}}>{props.name}</Link>
           </div>
        </div>
    )
}