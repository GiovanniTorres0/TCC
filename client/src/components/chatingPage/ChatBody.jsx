import React, { useEffect } from "react";

const ChatBody = ({
  messages,
  typingStatus,
  lastMessageRef,
  currentSocketID,
}) => {

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, lastMessageRef]);

  return (
    <>
      <header className="chat__mainHeader">
      </header>

      <div className="message__container">
        {messages.map((message, index) => (
          <div
            className={`message__chats ${
              message.socketID === currentSocketID
                ? "own-message"
                : "other-message"
            }`}
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <p className="sender__name">
              {message.socketID === currentSocketID ? "Você" : message.name}
            </p>
            <div className="message__content">
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
      </div>
    </>
  );
};

export default ChatBody;
