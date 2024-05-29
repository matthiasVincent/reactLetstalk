export function Photo({url, isFriend, info}){
    return(
        <div className="col p-1 d-flex flex-column"> 
            <img src={url} style={{borderRadius: '10px', width: '100%', aspectRatio: '1/1', objectFit: 'cover'}}/>
            {
                isFriend &&  <p className="h6 text-center">{`${info.first_name} ${info.last_name}`.length > 6 ?
                `${info.first_name} ${info.last_name}`.slice(0, 6) + '...'
                 :
                 `${info.first_name} ${info.last_name}`}</p>
            }
        </div>
    )
}