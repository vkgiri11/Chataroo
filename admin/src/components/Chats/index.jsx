import { Box } from '@chakra-ui/react';

import { ChatState } from '../../context/chatProvider';
import ChatBox from './ChatBox';
import MyChats from './MyChats';
import SideDrawer from './SideDrawer';

const index = () => {
	const { user } = ChatState();

	return (
		<>
			<div style={{ width: '100%' }}>
				{user && (
					<>
						<SideDrawer />
						<Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
							<MyChats />
							<ChatBox />
						</Box>
					</>
				)}
			</div>
		</>
	);
};
export default index;
