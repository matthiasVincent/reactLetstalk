export  function FormatPostDate(created){
    let format;
    const today = new Date()
    const todaySeconds = today.getTime()
    const passDate = new Date(created)
    const passDateSeconds = passDate.getTime()
    const milliDiff = todaySeconds-passDateSeconds
    const hourSeconds = 60 * 60
    const k = 1000
    const diff = milliDiff/k

    if (diff < 20){
        format = "just now"
    }
    else if (diff > 20 && diff < 60){
        format = Math.floor(diff) + " secs"
    }
    else if (diff >= 60 && diff < hourSeconds){
    format = Math.floor(diff/60) > 1 ?  Math.floor(diff/60) + " mins" : Math.floor(diff/60) + " min"
    }
    else if (diff >= hourSeconds && diff < (24 * hourSeconds)){
    format = Math.floor(diff/(60 * 60)) + "h"
    }
    else if (diff >= (24 * hourSeconds) && diff < (7 * 24 * hourSeconds)){
    format = Math.floor(diff/(24 * hourSeconds)) + "d"
    }
    else{
    let dateString = passDate.toDateString().split(" ")
    format = dateString[2] + " " + dateString[1] + ", " + dateString[3]
    }
    return format
}