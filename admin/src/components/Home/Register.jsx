import { useState } from 'react';
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	useToast,
	VStack,
} from '@chakra-ui/react';

const Register = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		pic: '',
		confirmPassword: '',
		showPassword: false,
	});
	const toast = useToast();

	const uploadPicture = (file) => {
		setLoading(true);

		if (!file) {
			toast({
				title: 'Please select an image !!',
				status: 'warning',
				duration: 2000,
				isClosable: true,
			});

			return;
		}

		const reader = (readFile) =>
			new Promise((resolve, reject) => {
				const fileReader = new FileReader();
				fileReader.onload = () => resolve(fileReader.result);
				fileReader.readAsDataURL(readFile);
			});

		reader(file)
			.then((result) => {
				setPostData((prev) => ({ ...prev, pic: result }));
			})
			.catch((err) => {
				console.log(err);
			});

		setLoading(false);
	};

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
						accept=".png, .jpg, .jpeg"
						onChange={(e) => uploadPicture(e.target.files[0])}
					/>
				</FormControl>
				<Button
					colorScheme="blue"
					width="100%"
					style={{ marginTop: 15 }}
					isLoading={loading}
					onClick={submitHandler}>
					Register
				</Button>
			</VStack>
		</>
	);
};
export default Register;
