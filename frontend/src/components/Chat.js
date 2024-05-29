import { useState } from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket'
import { host_port } from './services/AuthHeader';

export function Chat(){
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [messageHistory, setMessageHistory] = useState([])
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const {readyState, sendJsonMessage} = useWebSocket('ws://127.0.0.1:8000', {
    onOpen: () => {
      console.log("connected!")
    },
    onClose: () => {
      console.log("Disconnected")
    },
    onMessage: (e) => {
      const data = JSON.parse(e.data)
    switch (data.type){
      case "welcome_message":
        setWelcomeMessage(data.message)
        break;
      case "chat_message":
        console.log(data)
        setMessageHistory((prev) => prev.concat(data))
        console.log(messageHistory)
        break;
        default:
          console.log("Notsupported")
          break;
    }
  }
})

  const status = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState]



  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const handleChangeMessage = (e) => {
    setMessage(e.target.value)
  }

  const handleSubmit = () => {
    sendJsonMessage(
      {
        type: "chat_message",
        message,
        name
      }
    )
    setName('')
    setMessage('')
  }

  const all_msg = messageHistory.map((message, idx) => (
    <div className='bg-success p-3' key={idx}>
    {message.name}: {message.message}
  </div>
  ))

  return (
    <div className='container d-flex flex-column p-3 bg-light'>
      <p>{`${welcomeMessage} ${status}`}</p>
      <input
        name='name'
        placeholder='Name'
        onChange={handleChangeName}
        value={name}
      />
      <input
        name='message'
        placeholder='Message'
        onChange={handleChangeMessage}
        value={message}
      />
      <button className='btn btn-primary' onClick={handleSubmit}>Send</button>
      <hr/>
      <ul>
        <p>All messages...</p>
       {all_msg}
      </ul>
    </div>
  );
}