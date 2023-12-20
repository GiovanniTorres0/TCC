// ./chatingPage/ChatFooter.jsx
import React, { useState, useRef } from 'react';

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', `${localStorage.getItem('userName')} está digitando`);
    }

  
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', ''); 
    }, 2000); 
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem('userName')) {
      socket.emit('message', {
        text: message,
        name: localStorage.getItem('userNameReal'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });      
    }
    setMessage('');
    setIsTyping(false); 
    socket.emit('typing', ''); 
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Escreva a mensagem"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="sendBtn">ENVIAR</button>
      </form>
    </div>
  );
};

export default ChatFooter;
