import { Link } from "react-router-dom"
import { FaThumbsUp } from "react-icons/fa"
import { FaComment } from "react-icons/fa"
import { useState } from "react"
import axios from "axios";

export function GenRxn(){
    return(
        <div className="rxn p-0">
            <div className="d-flex flex-column p-2">
                <p style={{color: 'green'}}>You
                    <span>Liked this</span>
                </p>
            </div>
            <div className="d-flex p-2 justify-content-between">
                    <div className="px-2 py-1"
                        style={{backgroundColor: 'whitesmoke', borderRadius: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '45%'}}>
                        <FaThumbsUp className="text-dark m-0" aria-hidden="true" style={{cursor: 'pointer', fontSize: '25px'}}/>
                        <span className="ml-2 text-dark">0</span>
                    </div>
                    <div className="px-2 py-1" 
                        style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '45%', backgroundColor: 'whitesmoke', borderRadius: '25px', }}>
                        <Link to={"/posts/${post.post_id}"} className="text-decoration-none p-2 w-100" 
                            style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <FaComment className="text-secondary" style={{fontSize: '25px'}}/>
                            <span className="ml-2 text-dark">0</span>
                        </Link>
                    </div>
            </div>
        </div>
    )
}