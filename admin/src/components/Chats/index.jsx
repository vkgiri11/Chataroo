import { Box } from '@chakra-ui/react';
import { useState } from 'react';

import { ChatState } from '../../context/chatProvider';
import ChatBox from './ChatBox';
import MyChats from './MyChats';
import SideDrawer from './SideDrawer';

const index = () => {
	const [refreshList, setRefreshList] = useState(false);

	const { user } = ChatState();

	return (
		<>
			<div style={{ width: '100%' }}>
				{user && (
					<>
						<SideDrawer />
						<Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
							<MyChats refreshList={refreshList} />
							<ChatBox setRefreshList={setRefreshList} />
						</Box>
					</>
				)}
			</div>
		</>
	);
};
export default index;
