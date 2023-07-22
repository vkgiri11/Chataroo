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

const Register = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		showPassword: false,
	});

	const uploadPicture = () => {};

	const submitHandler = () => {};

	return (
		<>
			<VStack spacing="5px">
				<FormControl id="first-name" isRequired>
					<FormLabel>Name</FormLabel>
					<Input
						value={formData.name}
						placeholder="Enter Your Name"
						onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
					/>
				</FormControl>
				<FormControl id="login-email" isRequired>
					<FormLabel>Email Address</FormLabel>
					<Input
						type="email"
						value={formData.email}
						placeholder="Enter Your Email Address"
						onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
					/>
				</FormControl>
				<FormControl id="login-password" isRequired>
					<FormLabel>Password</FormLabel>
					<InputGroup size="md">
						<Input
							type={formData.showPassword ? 'text' : 'password'}
							value={formData.password}
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
				<FormControl id="confirm-password" isRequired>
					<FormLabel>Confirm Password</FormLabel>
					<InputGroup size="md">
						<Input
							type={formData.showPassword ? 'text' : 'password'}
							value={formData.confirmPassword}
							placeholder="Confirm password"
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
							}
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
				<FormControl id="pic">
					<FormLabel>Upload your Picture</FormLabel>
					<Input
						type="file"
						p={1.5}
						accept="image/*"
						onChange={(e) => uploadPicture(e.target.files[0])}
					/>
				</FormControl>
				<Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler}>
					Register
				</Button>
			</VStack>
		</>
	);
};
export default Register;
IeWfwCYcht5RRsqj