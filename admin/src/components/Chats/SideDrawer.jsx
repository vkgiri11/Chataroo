import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Avatar,
	Box,
	Button,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';

import { ChatState } from '../../context/chatProvider';
import ProfileModal from '../Misc/ProfileModal';

const SideDrawer = () => {
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	const navigateTo = useNavigate();
	const { user } = ChatState();

	const logoutHandler = () => {
		localStorage.removeItem('loggedUserInfo');
		navigateTo('/home');
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
					<Button variant="ghost">
						<i className="fas fa-search"></i>
						<Text d={{ base: 'none', md: 'flex' }} px={4}>
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize="2xl" fontFamily="NotoSans">
					Chataroo
				</Text>
				<div>
					<Menu>
						<MenuButton p={1}>
							<BellIcon fontSize="2xl" m={1} />
						</MenuButton>
						{/* <MenuList></MenuList> */}
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
		</>
	);
};
export default SideDrawer;
