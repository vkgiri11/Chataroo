import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { ChatState } from '../../context/chatProvider';
import { asyncWrap, getSender, getSenderDetails } from '../../utils';
import ProfileModal from '../Misc/ProfileModal';
import UpdateGroupChat from './UpdateGroupChat';
import ScrollableChat from './ScrollableChat';

const SERVER = import.meta.env.VITE_SERVER;
let socket, selectedChatCompare;

const SingleChat = ({ setRefreshList }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [endTyping, setEndTyping] = useState(false);
	const [isSocketConnected, setIsSocketConnected] = useState(false);

	const { user, selectedChat, setSelectedChat } = ChatState();

	const toast = useToast();

	const fetchMessages = async () => {
		if (!selectedChat) return;

		try {
			setLoading(true);

			const [res, err] = await asyncWrap(
				axios.get(`message/${selectedChat._id}`, {
					content: newMessage,
					to_chatId: selectedChat._id,
				})
			);

			setMessages(res.data.data);
			socket.emit('join_chat', selectedChat._id);
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error Occured!',
				description: 'Failed to Load the Messages',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		}

		setLoading(false);
	};

	const typingHandler = (e) => {
		setNewMessage(e.target.value);

		if (!isSocketConnected) return;

		if (!endTyping) {
			setEndTyping(true);
			socket.emit('typing', selectedChat._id);
		}

		const lastTypingTime = new Date().getTime();
		const typingTimeLimit = 3000;

		setTimeout(() => {
			const timeNow = new Date().getTime();
			const timeDiff = timeNow - lastTypingTime;

			if (timeDiff >= typingTimeLimit && endTyping) {
				socket.emit('stop_typing', selectedChat._id);
				setEndTyping(false);
			}
		}, typingTimeLimit);
	};

	const sendMessage = async (e) => {
		if (e.key === 'Enter' && newMessage) {
			socket.emit('stop_typing', selectedChat._id);

			try {
				setNewMessage('');

				const [res, err] = await asyncWrap(
					axios.post('message', {
						content: newMessage,
						to_chatId: selectedChat._id,
					})
				);

				socket.emit('new_message', res.data.data);
				setMessages((p) => [...p, res.data.data]);
			} catch (error) {
				console.log(error);
				toast({
					title: 'Error Occured!',
					description: 'Failed to send the Message',
					status: 'error',
					duration: 5000,
					isClosable: true,
					position: 'bottom',
				});
			}
		}
	};

	useEffect(() => {
		fetchMessages();

		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	useEffect(() => {
		socket = io(SERVER);
		socket.emit('setup', user._id);
		socket.on('connected', () => setIsSocketConnected(true));
		socket.on('typing', () => setIsTyping(true));
		socket.on('stop_typing', () => setIsTyping(false));
	}, []);

	useEffect(() => {
		socket.on('message_recieved', (newRecievedMsg) => {
			// if someone other than selected chat user sends a msg
			if (!selectedChatCompare || selectedChatCompare._id !== newRecievedMsg.chat._id) {
				// give a notification
			} else {
				setMessages([...messages, newRecievedMsg]);
			}
		});
	});

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: '28px', md: '30px' }}
						pb={3}
						px={2}
						w="100%"
						fontFamily="Noto sans"
						display="flex"
						justifyContent={{ base: 'space-between' }}
						alignItems="center">
						<IconButton
							display={{ base: 'flex', md: 'none' }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat('')}
						/>
						{selectedChat.isGroupChat ? (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChat setRefreshList={setRefreshList} fetchMessages={fetchMessages} />
							</>
						) : (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModal user={getSenderDetails(user, selectedChat.users)} />
							</>
						)}
					</Text>
					<Box
						display="flex"
						flexDir="column"
						justifyContent="flex-end"
						p={3}
						bg="#E8E8E8"
						w="100%"
						h="100%"
						borderRadius="lg"
						overflowY="hidden">
						{loading ? (
							<Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
						) : (
							<Box
								display="flex"
								flexDir="column"
								overflowY="srcoll"
								style={{ scrollbarWidth: 'none' }}>
								<ScrollableChat messages={messages} />
							</Box>
						)}

						<FormControl onKeyDown={sendMessage} isRequired mt={3}>
							{isTyping ? <>Loading...</> : <></>}
							<Input
								variant="filled"
								bg="#E0E0E0"
								placeholder="Enter a message.."
								value={newMessage}
								onChange={typingHandler}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				<Box display="flex" alignItems="center" justifyContent="center" h="100%">
					<Text fontSize="3xl" pb={3} fontFamily="Noto sans">
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</>
	);
};
export default SingleChat;
