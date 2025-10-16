import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatRoomId, setChatRoomId] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const selectUser = (user, currentUserId) => {
        if (!currentUserId || !user?.uid) return;

        const roomId =
            currentUserId < user.uid
                ? `${currentUserId}_${user.uid}`
                : `${user.uid}_${currentUserId}`;

        setSelectedUser(user);
        setChatRoomId(roomId);
    };

    return (
        <ChatContext.Provider
            value={{ chatRoomId, selectedUser, selectUser }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
