// ./chatingPage/ChatPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import socketIO from "socket.io-client";
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import Navbar from '../menuPage/NavBar';
import './Chat.css';

const ChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const lastMessageRef = useRef(null);

  useEffect(() => {
    console.log('Tentando conectar ao Socket.io');
    const newSocket = socketIO.connect("http://localhost:4000", { withCredentials: true });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Conectado ao Socket.io');

      const email = localStorage.getItem('userName');
      newSocket.emit('fetchUserName', { email: email });

      const nomeReal = localStorage.getItem("userNameReal");
      if (nomeReal) {
        newSocket.emit("newUser", { userNameReal: nomeReal });
      }
    });

    newSocket.on('userNameResponse', (data) => {
      if (data.userName) {
        localStorage.setItem('userName', data.userName);
      } else {
        console.error("Error fetching user name:", data.error);
      }
    });
        
    newSocket.on('messageResponse', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    newSocket.on('typingResponse', (data) => {
      setTypingStatus(data);
    });

    return () => {
      console.log('Desconectando do Socket.io');
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="chat-page-container">
      <Navbar />
      <div className="chat">
        <div className="chat__main">
          <ChatBody messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef} currentSocketID={socket ? socket.id : null} />
          <ChatFooter socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
