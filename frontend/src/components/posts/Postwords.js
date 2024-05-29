import { useState } from "react"

export function PostWords({post}){
    const [truncate, setTruncate] = useState('none')
    const [seemore, setSeeMore] = useState('block')
    function handleTruncate(){
        setSeeMore('block')
        setTruncate('none')
    }
function handleSeeMore(){
    setSeeMore('none')
    setTruncate('block')
    console.log(seemore)
}

    return (
        <div className="p-3 text-justify">
            <p className="post-words" style={{display:truncate, cursor: 'pointer'}} onClick={handleTruncate}>
                {post.words}
            </p>
        <p className="post-words" style={{display: seemore}}>
            {post.words.length > 40 ?
            (
                <>
                    {post.words.slice(0, 40) + `...` }
                    <span className="text-primary showfull" onClick={handleSeeMore} style={{cursor: 'pointer'}}>See more</span>
                </>
            )
            : post.words}
        </p>
      </div>
    )
}