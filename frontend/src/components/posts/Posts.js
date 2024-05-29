import { PostHeader } from "./PostHeader"
import { PostWords } from "./Postwords"
import { TwoPostPictures } from "./pictures/Two"
import { OnePostPicture } from "./pictures/One"
import { ThreePostPictures } from "./pictures/Three"
import { FourPostPictures } from "./pictures/Four"
import { FivePostPictures } from "./pictures/Five"
import { OtherPostPictures } from "./pictures/Others"
import { PostRxn } from "./PostRxn"

export default function Post({post, pictures_length, user}){

    return(
       <>
        <div className="pst-cont pt-2 mb-2" id="posts-container" style={{backgroundColor: 'white'}}>
            <PostHeader post={post} />
            <PostWords post={post} />
            {
                pictures_length > 0 && (
                    pictures_length === 1 ? 
                    <OnePostPicture post={post} />
                     : pictures_length === 2? 
                     <TwoPostPictures post={post} /> 
                     : pictures_length === 3?
                     <ThreePostPictures post={post} />
                     : pictures_length === 4?
                     <FourPostPictures post={post} />
                     : pictures_length === 5 ?
                     <FivePostPictures post={post} />
                     : <OtherPostPictures post={post} />
                )
            }
            <PostRxn post={post} user={user} />
        </div>
       </>
    )
}