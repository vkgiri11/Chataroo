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
	useDisclosure,
	useToast,
} from '@chakra-ui/react';

import { ChatState } from '../../context/chatProvider';
import { asyncWrap } from '../../utils';
import ChatLoading from '../Misc/ChatLoading';
import UserBadgeItem from '../Misc/UserBadgeItem';
import UserListItem from '../Misc/UserListItem';

const GroupChatModal = ({ children }) => {
	const [groupChatName, setGroupChatName] = useState('');
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);

	const { setChats } = ChatState();

	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleModalClose = () => {
		setSearchResult([]);
		onClose();
	};

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

	// :TODO - Add debounce
	const handleSearch = async (query) => {
		if (!query) return;

		try {
			setLoading(true);

			const [res, err] = await asyncWrap(axios.get(`user?search=${query}`));

			setSearchResult(res.data.data);
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
		}

		setLoading(false);
	};

	const handleSubmit = async () => {
		setSubmitLoading(true);

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

		try {
			const payload = {
				group_name: groupChatName,
				users: selectedUsers.map((elem) => elem._id),
			};

			const [res, err] = await asyncWrap(axios.post('chat/create_group', payload));

			setChats((p) => [res.data.data, ...p]);
			handleModalClose();
			toast({
				title: 'New Group Chat Created!',
				status: 'success',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
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

		setSubmitLoading(false);
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>
			<Modal onClose={handleModalClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="35px"
						fontFamily="Noto sans"
						display="flex"
						justifyContent="center">
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

						<Box display="flex" flexDir="column" w="100%" h="100%">
							{loading ? (
								<ChatLoading number={4} />
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
						</Box>
					</ModalBody>
					<ModalFooter>
						<Button onClick={handleSubmit} isDisabled={submitLoading} colorScheme="blue">
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
export default GroupChatModal;
