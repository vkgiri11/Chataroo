import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const [user, setUser] = useState();
	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState();
	const [notification, setNotification] = useState([]);

	const navigateTo = useNavigate();

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem('loggedUserInfo'));
		setUser(userInfo);

		if (!userInfo) navigateTo('/home');
	}, [navigateTo]);

	return (
		<ChatContext.Provider
			value={{
				user,
				setUser,
				chats,
				setChats,
				selectedChat,
				setSelectedChat,
				notification,
				setNotification,
			}}>
			{children}
		</ChatContext.Provider>
	);
};

export const ChatState = () => {
	return useContext(ChatContext);
};

