export function Loader(){
    return(
    <div className="effect-loading" 
        style={
            {
                backgroundColor: 'rgba(255,255,255, 1)',
                zIndex: 100,
            }
        }>
        <div className="load-hd">
            <div className="prof-pic"></div>
            <div className="write-s"></div>
        </div>
        <hr />
        <div className="load-posts">
            <div className="load-hd-post">
                <div className="prof-pic"></div>
                <div className="write-s"></div>
            </div>
            <div className="post-contents"></div>
        </div>
        <hr />
        <div className="load-posts">
            <div className="load-hd-post">
                <div className="prof-pic"></div>
                <div className="write-s"></div>
            </div>
            <div className="post-contents"></div>
        </div>
        <hr />
        <div className="load-posts">
            <div className="load-hd-post">
                <div className="prof-pic"></div>
                <div className="write-s"></div>
            </div>
            <div className="post-contents"></div>
        </div>
        <hr />
    </div>

    // <p className="text-center">Fetching, Please wait ...</p>
    )
}