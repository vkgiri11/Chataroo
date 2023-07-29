import { useState } from 'react';
import axios from 'axios';
import {
	Box,
	Button,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';

import { ChatState } from '../../context/chatProvider';
import { asyncWrap } from '../../utils';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';

const GroupChatModal = ({ children }) => {
	const [groupChatName, setGroupChatName] = useState('');
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);

	const { user, chats, setChats } = ChatState();

	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: 'User already added',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		setSelectedUsers((p) => [...p, userToAdd]);
	};

	const handleDelete = (delUser) => {
		setSelectedUsers((p) => p.filter((item) => item._id !== delUser._id));
	};

	const handleSearch = async (query) => {
		setSearch(query);

		if (!query) return;

		try {
			setLoading(true);

			const [res, err] = await asyncWrap(axios.get(`user?search=${search}`));

			setSearchResult(res.data.data);
			setLoading(false);
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error Occured!',
				description: 'Failed to Load the Search Results',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
			setLoading(false);
		}
	};

	const handleSubmit = async () => {
		if (!groupChatName) {
			toast({
				title: 'Chat Name is required',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		if (selectedUsers.length < 2) {
			toast({
				title: 'At least 2 users required to create a group.',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		const payload = {
			group_name: groupChatName,
			users: selectedUsers.map((elem) => elem._id),
		};

		const [res, err] = await asyncWrap(axios.post('chat/create_group', payload));

		setChats(p => [res.data.data, ...p])
		onClose();
		toast({
			title: 'New Group Chat Created!',
			status: 'success',
			duration: 5000,
			isClosable: true,
			position: 'bottom',
		});
		try {
		} catch (error) {
			console.log(error);
			toast({
				title: 'Failed to Create the Chat!',
				description: error.response.data,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		}
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="35px" fontFamily="Notosans" display="flex" justifyContent="center">
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display="flex" flexDir="column" alignItems="center">
						<FormControl>
							<Input
								placeholder="Enter Group Name"
								mb={3}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add Users eg: Conan, Hattori, Akai"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>

						<Box w="100%" display="flex" flexWrap="wrap">
							{selectedUsers.map((item) => (
								<UserBadgeItem
									key={item._id}
									user={item}
									handleFunction={() => handleDelete(item)}
								/>
							))}
						</Box>

						{loading ? (
							<Text py={3}>Loading...</Text>
						) : (
							searchResult
								.slice(0, 4)
								.map((item) => (
									<UserListItem
										key={item._id}
										user={item}
										handleFunction={() => handleGroup(item)}
									/>
								))
						)}
					</ModalBody>
					<ModalFooter>
						<Button onClick={handleSubmit} colorScheme="blue">
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
export default GroupChatModal;
