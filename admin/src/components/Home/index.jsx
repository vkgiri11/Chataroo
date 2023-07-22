import { Box, Container, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import Login from './Login';
import Register from './Register';

const index = () => {
	return (
		<>
			<Container maxW="xl" centerContent={true}>
				<Box
					display="flex"
					justifyContent="center"
					p={3}
					bg="white"
					w="100%"
					m="40px 0 15px"
					borderRadius="lg">
					<Text fontSize="4xl" fontWeight="500" fontFamily="NotoSans" color="#28282B">
						CHATAROO
					</Text>
				</Box>
				<Box p={4} bg="white" w="100%" borderRadius="lg">
					<Tabs isFitted variant="soft-rounded">
						<TabList mb="1em">
							<Tab>Login</Tab>
							<Tab>Register</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								<Login />
							</TabPanel>
							<TabPanel>
								<Register />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
			</Container>
		</>
	);
};
export default index;
