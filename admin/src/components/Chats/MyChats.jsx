import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { ChatState } from '../../context/chatProvider';
import { asyncWrap, getSender } from '../../utils';
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal';

const MyChats = () => {
	const [loggedUser, setLoggedUser] = useState();
	const [loading, setLoading] = useState(false);

	const { user, chats, selectedChat, setSelectedChat, setChats } = ChatState();

	const toast = useToast();

	const fetchChats = async () => {
		try {
			setLoading(true);
			const [res, err] = await asyncWrap(axios.get('chat'));

			if (err) return;

			setChats(res.data.data);
			setLoading(false);
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error Occured!',
				description: 'Failed to Load the chats',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoggedUser(JSON.parse(localStorage.getItem('loggedUserInfo')));
		fetchChats();
	}, []);

	return (
		<>
			<Box
				display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
				flexDir="column"
				alignItems="center"
				p={3}
				bg="white"
				w={{ base: '100%', md: '31%' }}
				borderRadius="lg"
				borderWidth="1px">
				<Box
					pb={3}
					px={3}
					fontSize={{ base: '28px', md: '30px' }}
					fontFamily="Notosans"
					display="flex"
					w="100%"
					justifyContent="space-between"
					alignItems="center">
					My Chats
					<GroupChatModal>
						<Button
							display="flex"
							fontSize={{ base: '17px', md: '10px', lg: '17px' }}
							rightIcon={<AddIcon />}>
							New Group Chat
						</Button>
					</GroupChatModal>
				</Box>
				<Box
					display="flex"
					flexDir="column"
					p={3}
					bg="#F8F8F8"
					w="100%"
					h="100%"
					borderRadius="lg"
					overflowY="hidden">
					<Stack overflowY="auto">
						{loading ? (
							<ChatLoading />
						) : !chats.length ? (
							<Text display="flex" justifyContent="center" py={5}>
								No Chats Found
							</Text>
						) : (
							chats.map((item) => (
								<Box
									key={item._id}
									onClick={() => setSelectedChat(item)}
									cursor="pointer"
									bg={selectedChat === item ? '#38B2AC' : '#E8E8E8'}
									color={selectedChat === item ? 'white' : 'black'}
									px={3}
									py={2}
									borderRadius="lg">
									<Text>
										{!item.isGroupChat ? getSender(loggedUser, item.users) : item.chatName}
									</Text>
									{item.latestMessage && (
										<Text fontSize="xs">
											<b>{item.latestMessage.sender.name} : </b>
											{item.latestMessage.content.length > 50
												? item.latestMessage.content.substring(0, 51) + '...'
												: item.latestMessage.content}
										</Text>
									)}
								</Box>
							))
						)}
					</Stack>
				</Box>
			</Box>
		</>
	);
};
export default MyChats;
