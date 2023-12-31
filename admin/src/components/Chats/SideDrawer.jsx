import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spinner,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

import { ChatState } from '../../context/chatProvider';
import { asyncWrap, getSender } from '../../utils';
import ProfileModal from '../Misc/ProfileModal';
import ChatLoading from '../Misc/ChatLoading';
import UserListItem from '../Misc/UserListItem';

const SideDrawer = () => {
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	const navigateTo = useNavigate();
	const { user, chats, notification, setSelectedChat, setChats, setNotification } = ChatState();

	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const logoutHandler = () => {
		localStorage.removeItem('loggedUserInfo');
		window.location.reload();
		navigateTo('/home');
	};

	const handleDrawerClose = () => {
		setSearch('');
		setSearchResult([]);
		onClose();
	};

	const handleSearch = async () => {
		try {
			setLoading(true);

			const [res, err] = await asyncWrap(axios.get(`user?search=${search}`));

			if (res) setSearchResult(res.data.data);
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error Occured!',
				description: 'Failed to Load the Search Results',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'bottom-left',
			});
		}

		setLoading(false);
	};

	const accessChat = async (showUserId) => {
		try {
			setLoadingChat(true);

			const [res, err] = await asyncWrap(axios.post('chat', { userId: showUserId }));

			if (res) {
				// if a new chat is created append it to the existing list of chats current user already has
				if (!chats.find((item) => item._id === res.data.data._id))
					setChats((p) => [...p, res.data.data]);

				setSelectedChat(res.data.data);
				setLoadingChat(false);
				handleDrawerClose();
			}
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error fetching the chat!',
				description: 'Something went wrong!',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'bottom-left',
			});
			setLoadingChat(false);
		}
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="white"
				w="100%"
				p="5px 10px 5px 10px"
				borderWidth="5px">
				<Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
					<Button variant="ghost" onClick={onOpen}>
						<i className="fas fa-search"></i>
						<Text d={{ base: 'none', md: 'flex' }} px={4}>
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize="2xl" fontFamily="Noto sans">
					Chataroo
				</Text>
				<div>
					<Menu>
						<MenuButton p={1}>
							<NotificationBadge count={notification.length} effect={Effect.SCALE} />
							<BellIcon fontSize="2xl" m={1} />
						</MenuButton>
						<MenuList pl={2}>
							{!notification.length
								? 'No New Messages'
								: notification.map((item) => (
										<MenuItem
											key={item._id}
											onClick={() => {
												setSelectedChat(item.chat);
												setNotification(notification.filter((elem) => elem !== item));
											}}>
											{item.chat.isGroupChat
												? `New Message in ${item.chat.chatName}`
												: `New Message from ${getSender(user, item.chat.users)}`}
										</MenuItem>
								  ))}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
							<Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuDivider />
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<Drawer placement="left" onClose={handleDrawerClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
					<DrawerBody>
						<Box display="flex" pb={2}>
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button isDisabled={!search} onClick={handleSearch}>
								Go
							</Button>
						</Box>
						{loading ? (
							<ChatLoading />
						) : (
							searchResult?.map((item) => (
								<UserListItem
									key={item._id}
									user={item}
									handleFunction={() => {
										if (!loadingChat) accessChat(item._id);
									}}
								/>
							))
						)}
						{loadingChat && (
							<Box display="flex" justifyContent="center" mt={2}>
								<Spinner />
							</Box>
						)}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};
export default SideDrawer;
