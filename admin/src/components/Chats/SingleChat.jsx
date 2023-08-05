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
let socket;

const SingleChat = ({ setRefreshList }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [loading, setLoading] = useState(false);

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
	};

	const sendMessage = async (e) => {
		if (e.key === 'Enter' && newMessage) {
			try {
				setNewMessage('');

				const [res, err] = await asyncWrap(
					axios.post('message', {
						content: newMessage,
						to_chatId: selectedChat._id,
					})
				);

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
	}, [selectedChat]);

	useEffect(() => {
		socket = io(SERVER);
	}, []);

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
