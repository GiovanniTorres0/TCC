import React, { useState, useEffect } from 'react';

const ChatBar = ({ socket, clientSocketID }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (socket) {
            const listener = data => setUsers(data);
            socket.on("newUserResponse", listener);

            return () => {
                socket.off("newUserResponse", listener);
            };
        }
    }, [socket]);

    return (
        <div className='chat__sidebar'>
            <h2>Open Chat</h2>
            <div>
                <h4 className='chat__header'>ACTIVE USERS</h4>
                <div className='chat__users'>
                    {users.map(user => (
                        <p key={user.socketID}>
                            {user.socketID === clientSocketID ? 'You' : user.userName}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ChatBar;
