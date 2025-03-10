const Notification = ({message ,color })=>{
    console.log(message)
    if(message === '')return null

    const notificationStyle ={
        color : color,
        border : `solid 2px ${color}`,
        background : 'grey'
    }

    return(
        <div style={notificationStyle}>
        {message}
        </div>
    )
}
export default Notification