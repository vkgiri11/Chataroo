import { useState } from 'react';
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
} from '@chakra-ui/react';

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		showPassword: false,
	});

	const submitHandler = () => {};

	return (
		<>
			<VStack spacing="5px">
				<FormControl id="email" isRequired>
					<FormLabel>Email Address</FormLabel>
					<Input
						value={formData.email}
						type="email"
						placeholder="Enter Your Email Address"
						onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
					/>
				</FormControl>
				<FormControl id="password" isRequired>
					<FormLabel>Password</FormLabel>
					<InputGroup size="md">
						<Input
							value={formData.password}
							type={formData.showPassword ? 'text' : 'password'}
							placeholder="Enter Password"
							onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
						/>
						<InputRightElement width="4.5rem">
							<Button
								h="1.75rem"
								size="sm"
								onClick={() =>
									setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))
								}>
								{formData.showPassword ? 'Hide' : 'Show'}
							</Button>
						</InputRightElement>
					</InputGroup>
				</FormControl>
				<Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler}>
					Log In
				</Button>
				<Button
					variant="solid"
					colorScheme="red"
					width="100%"
					onClick={() => {
						setFormData({
							email: 'guest@example.com',
							password: '123456',
							showPassword: true,
						});
					}}>
					Get Guest User Credentials
				</Button>
			</VStack>
		</>
	);
};
export default Login;
