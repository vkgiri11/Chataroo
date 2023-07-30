import { Box } from '@chakra-ui/react';

import { ChatState } from '../../context/chatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ setRefreshList }) => {
	const { selectedChat } = ChatState();

	return (
		<>
			<Box
				display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
				alignItems="center"
				flexDir="column"
				p={3}
				bg="white"
				w={{ base: '100%', md: '68%' }}
				borderRadius="lg"
				borderWidth="1px">
				<SingleChat setRefreshList={setRefreshList} />
			</Box>
		</>
	);
};
export default ChatBox;
