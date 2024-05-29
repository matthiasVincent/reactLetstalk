export function formatMessageDate(created){
    let format;
    const today = new Date()
    const todaySeconds = today.getTime()
    const passDate = new Date(created)
    const passDateSeconds = passDate.getTime()
    const diff = todaySeconds-passDateSeconds
    const secondsInDay = 24 * 60 * 60 * 1000
    const secondsInWeek = 7 * secondsInDay
    const meridian = passDate.toLocaleTimeString().split(' ')[1]
    const timeFormat = passDate.toLocaleTimeString().split(":").slice(0, 2).join(":") + " " + meridian
    //console.log(timeFormat, meridian)

    if (diff < secondsInDay){
        let dayOfWeekName = passDate.toDateString().split(" ")[0]
        format = today.getDay() < passDate.getDay() ? `${dayOfWeekName}, ${timeFormat}` : timeFormat
    }
    else if (diff >= secondsInDay && diff < secondsInWeek){
        let dayOfWeekName = passDate.toDateString().split(" ")[0]
        format = `${dayOfWeekName}, ${timeFormat}`
    }
    else{
        let shortDate = passDate.toDateString().split(" ")
        //console.log(shortDate)
        format = `${shortDate[0]}, ${shortDate[2]} ${shortDate[1]}, ${shortDate[3]} ${timeFormat}` 
    }
return format
}

export function formatNewLine(words){
    return words.replace(/[(\n)(\r\n)]/g, `<br />`)
}

export const buddyUsername = (room_name, user) => {
    const usernamesPlus = room_name.split('_')
    const usernamesArray = [usernamesPlus[0].substring(0, 11), usernamesPlus[1].substring(0, 11)]
    for (let username of usernamesArray){
        if (username !== user?.user.username){
            return username
        }
    }
}


export function returnPostsFormatted(posts){
    const formatted = posts.map((post) => {
        const {post_id, ...rest} = post
        return ({[post_id]: rest})
    })
    return formatted
}