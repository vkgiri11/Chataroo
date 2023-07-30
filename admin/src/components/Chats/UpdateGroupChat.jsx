import { useState } from 'react';
import axios from 'axios';
import {
	Box,
	Button,
	FormControl,
	IconButton,
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
import { ViewIcon } from '@chakra-ui/icons';

import { ChatState } from '../../context/chatProvider';
import { asyncWrap } from '../../utils';
import UserBadgeItem from '../Misc/UserBadgeItem';
import UserListItem from '../Misc/UserListItem';
import ChatLoading from '../Misc/ChatLoading';

const UpdateGroupChat = ({ setRefreshList }) => {
	const [groupChatName, setGroupChatName] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameloading, setRenameLoading] = useState(false);

	const { user, selectedChat, setSelectedChat } = ChatState();

	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleModalClose = () => {
		setSearchResult([]);
		onClose();
	};

	const handleRename = async () => {
		try {
			setRenameLoading(true);

			const [res, err] = await asyncWrap(
				axios.put('chat/rename_group', {
					groupId: selectedChat._id,
					groupName: groupChatName,
				})
			);

			setSelectedChat(res.data.data);
			setRefreshList((p) => !p);
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error Occured!',
				description: error.response.data.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		}

		setRenameLoading(false);
		setGroupChatName('');
	};

	const handleAddUser = async (addUser) => {
		if (selectedChat.users.find((elem) => elem._id === addUser._id)) {
			toast({
				title: 'User Already in group!',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			return;
		}

		if (selectedChat.groupAdmin._id !== user._id) {
			toast({
				title: 'Only admins can add someone!',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			return;
		}

		try {
			setLoading(true);

			const [res, err] = await asyncWrap(
				axios.put('chat/add_to_group', {
					chatId: selectedChat._id,
					userId: addUser._id,
				})
			);

			setSelectedChat(res.data.data);
			setRefreshList((p) => !p);
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error Occured!',
				description: error.response.data.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		}

		setLoading(false);
	};

	const handleRemove = async (delUser) => {
		if (selectedChat.groupAdmin._id !== user._id && user._id !== delUser._id) {
			toast({
				title: 'Only admins can remove someone!',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			return;
		}

		try {
			setLoading(true);

			const [res, err] = await asyncWrap(
				axios.put('chat/remove_from_group', {
					chatId: selectedChat._id,
					userId: delUser._id,
				})
			);

			delUser._id === user._id ? setSelectedChat() : setSelectedChat(res.data.data);
			setRefreshList((p) => !p);
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error Occured!',
				description: error.response.data.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		}

		setLoading(false);
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

	return (
		<>
			<IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
			<Modal onClose={handleModalClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="35px"
						fontFamily="Noto sans"
						display="flex"
						justifyContent="center">
						{selectedChat.chatName}
					</ModalHeader>

					<ModalCloseButton />
					<ModalBody display="flex" flexDir="column" alignItems="center">
						<Box w="100%" display="flex" flexWrap="wrap" pb={3}>
							{selectedChat.users.map((u) => (
								<UserBadgeItem
									key={u._id}
									user={u}
									admin={selectedChat.groupAdmin._id}
									handleFunction={() => handleRemove(u)}
								/>
							))}
						</Box>
						<FormControl display="flex">
							<Input
								placeholder="Chat Name"
								mb={3}
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								variant="solid"
								colorScheme="teal"
								ml={1}
								isDisabled={!groupChatName}
								isLoading={renameloading}
								onClick={handleRename}>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add User to group"
								mb={3}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>

						<Box display="flex" flexDir="column" w="100%" h="100%">
							{loading ? (
								<ChatLoading number={4} />
							) : (
								searchResult
									.slice(0, 4)
									?.map((item) => (
										<UserListItem
											key={item._id}
											user={item}
											handleFunction={() => handleAddUser(item)}
										/>
									))
							)}
						</Box>
					</ModalBody>
					<ModalFooter>
						<Button onClick={() => handleRemove(user)} colorScheme="red">
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
export default UpdateGroupChat;
