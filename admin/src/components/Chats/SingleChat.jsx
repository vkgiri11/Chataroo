import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { ChatState } from '../../context/chatProvider';
import { getSender, getSenderDetails } from '../../utils';
import ProfileModal from '../Misc/ProfileModal';
import UpdateGroupChat from './UpdateGroupChat';

const SingleChat = ({ refreshList, setRefreshList }) => {
	const { user, selectedChat, setSelectedChat } = ChatState();

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
								<UpdateGroupChat refreshList={refreshList} setRefreshList={setRefreshList} />
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
						overflowY="hidden"></Box>
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
