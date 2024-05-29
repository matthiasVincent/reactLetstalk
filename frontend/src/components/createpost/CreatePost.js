import { Link } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { host_port } from "../services/AuthHeader"

function Header(){
    return (
        <div className="container-fluid bg-dark d-flex justify-content-between align-items-center p-3">
            <p className="h5 text-white">Create Post</p>
            <Link to='/' className="h5 text-decoration-none text-white">Cancel</Link>
        </div>
    )
}

function ImagesSelected({file, id, onRemoveImage}){
    const file_name = file.name
    const img_url = URL.createObjectURL(file)

    function handleRemove(){
        onRemoveImage(id)
    }
    return (
        <div className="d-flex flex-column  table-light pt-2 px-2 " style={{ position: 'relative'}}>
            <img src={img_url} alt=""   className="bg-dark" style={{borderRadius:'15px', width: "230px", aspectRatio: '1/1.25', objectFit: 'cover'}}/>
            <p className="px-3">{file_name.slice(0, 10)}</p>
            <button
                type="button"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    padding: '5px',
                    border: 'none',
                    backgroundColor: 'white',
                    color: 'black',
                    fontSize: '20px',
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: '5%',
                    right: '5%',
                }}
                onClick={handleRemove}
                >&times;</button>
        </div>
    )

}


export default function CreatePost(){
    const {setPosts} = useContext(AuthContext)
    const {user} = useContext(AuthContext)
    const [files, setFiles] = useState([])
    const [words, setWords] = useState('')
    const navigate = useNavigate()
    console.log(files)

    function add(photos){
        const chosen = [...files]
        for (let p of photos){
            chosen.push(p)
        }
        return chosen
    }

    function handleChange(e){
        const photos = Array.from(e.target.files)
        console.log(e.target.files)
        const ret = add(photos)
        setFiles(ret)
    }

    function onRemoveImage(id){
        setFiles(files.filter((file, ind) => ind !== id))
    }

    function handleSubmit(e){
        e.preventDefault()
        var formD = new FormData()
        formD.append('words', words)
        // const loaded_files = {}
        for (let i = 0; i < files.length; i++){
            formD.append('post_image', files[i])
        }
        //formD.append("post_image", [...files])
        formD.append('username', user.user.username)

        for (let [k, v] of formD){
            console.log(k, v)
        }
        axios.post(`http://${window.location.hostname}:${host_port}/post/`, formD, {headers: {'content-type': 'multipart/form-data'}}).then(
            (resp) => resp.data).then(data => {
                setPosts((prev) => [data.data, ...prev])
                //console.log(posts)
                navigate('/')
            }).catch((error) => console.log(error))
    }

    function handleText(e){
        setWords(e.target.value)
    }


    return (
        <>
            <Header />
            <div className="post-wrapper  p-3 bg-light">
            <div className="d-flex justify-content-end">
                <button  className="sub1 btn btn-transparent text-primary p-2 mb-2">Post</button>
            </div>

            <form  onSubmit={handleSubmit}className="d-flex flex-column form" encType="multipart/form-data">
            <textarea name="words" id="" cols="30" rows="10" className="form-control p-3 bg-transparent" placeholder="What is on your mind?" onChange={handleText} value={words}>{words}</textarea>
                <div className="d-flex flex-column  p-3">
                    <div className="show-selected p-2"  style={{display: 'flex', overflowX: 'auto', width: '100%'}}>
                        {/* <!-- to show selected files --> */}
                        {
                           files.map((file, index) => {

                                return (
                                    <ImagesSelected file={file} id={index} key={index} onRemoveImage={onRemoveImage} />
                                )
                             
                           })
                        }
                       
                    </div>
                    <div className="inp-wrapper d-flex justify-content-between align-items-center mt-2">
                        <label htmlFor="post_image" className="btn btn-info p-2 mb-0">Chose file</label>
                        <input type="file" className="form-control  mr-2 d-none file_in" name="post_image" style={{width: '100px'}} id="post_image" multiple onChange={handleChange} />
                        <input type="hidden" name="username" value={user.user.username} />
                        <button type="submit" className="sub2 btn btn-primary p-2 mb-0">Post</button>
                    </div>
                </div>
            </form> 
        </div> 
        </>
    )
}