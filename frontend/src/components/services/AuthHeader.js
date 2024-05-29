export default function authHeader() {
    const localstorageUser = localStorage.getItem('user')
    if (!localstorageUser) {
        return {}
    }
    const user = JSON.parse(localstorageUser)
    if (user && user.token){
        return {
            Authorization: `Token ${user.token}`
        }
    }
    return {}
}

export const normalizeUrl = (url) => {
    const id_position = url.indexOf('id')
    const remain_string = url.substr(id_position + 3).split('&')
    const drive_id = remain_string[0]
    const new_url = `https://drive.google.com/thumbnail?id=${drive_id}`
    return new_url
}


export const sortConversationMessages = (messages) => {
    //messages from the backend comes in serialized form
    //that is date string, we need to transform it to date object before sorting
    const messageWithTransformedDate = messages.messages.map(user => {
        return {...user, created: new Date(user.created)}
    })
    console.log(messageWithTransformedDate)
    //sort message in ascending order
    const sorted_message = messageWithTransformedDate.sort((a, b) => Number(b.created) - Number(a.created))
    console.log(sorted_message)
    return sorted_message
}


export const isOnline = (arr, username) => {
    for (let i = 0; i < arr.length; i++)
    {
        if (arr[i] === username){
            return true
        }
    }
    return false
}

export const host_port = 83