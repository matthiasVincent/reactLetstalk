import { AuthContext } from "./context/AuthContext";
import { useContext, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { PostHeader } from "./posts/PostHeader";
import { FaArrowLeft } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SinglePhoto } from "./SinglePhoto";
import { PostRxn } from "./posts/PostRxn";
import { PostWords } from "./posts/Postwords";
import { useSearchParams, useNavigate } from "react-router-dom";

function PhotoHeader({post, onHandleNavigate}){
    return (
        <div className="container-fluid bg-light d-flex align-items-center p-3 fixed-top">
            <div role="button" onClick={onHandleNavigate} className="h6 text-dark">
                <FaArrowLeft />
            </div>
        </div>
    )
}



export function DetailPictures(){
   const {user, posts} = useContext(AuthContext)
   const {post_id} = useParams()
   const post = posts.filter((post) => post.post_id === post_id)
   const [single] = [...post]
   const postPhotos = single?.post_pictures
   const {pathname} = useLocation()
   const [params] = useSearchParams()
   const navigate = useNavigate()
   const handleNavigate = () => navigate(-1)
   console.log(postPhotos)
   console.log(pathname, params.get('target'))
   const target =  params.get('target')

   useEffect(() => {
    const tgt = document.getElementById(`${params.get('target')}`)
    tgt.scrollIntoView({
        behavior: 'smooth',
    })
   }, [target] )

   return(
    <>
     <PhotoHeader post={post} onHandleNavigate={handleNavigate} />
     <div className="container-photos pt-2 mb-2" id="posts-container" style={{backgroundColor: 'white', marginTop: '55px'}}>
        <PostHeader post={single} />
        <PostWords post={single} />
        <PostRxn post={single} user={user} />
        {
        postPhotos && (
            postPhotos.map((image) => <SinglePhoto image={[image]} key={image.id}/>)
        )
     }
     </div>
    </>
   )
}