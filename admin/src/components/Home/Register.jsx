import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

import { setToken } from '../../axiosDefaults';
import { asyncWrap, emptyCheck } from '../../utils';

const Register = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		pic: undefined,
		confirmPassword: '',
		showPassword: false,
	});
	const toast = useToast();

	const navigateTo = useNavigate();

	const uploadPicture = (file) => {
		setLoading(true);

		const reader = (readFile) =>
			new Promise((resolve, reject) => {
				const fileReader = new FileReader();
				fileReader.onload = () => resolve(fileReader.result);
				fileReader.readAsDataURL(readFile);
			});

		reader(file)
			.then((result) => {
				setFormData((prev) => ({ ...prev, pic: result }));
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	const submitHandler = async () => {
		setLoading(true);

		if (emptyCheck(formData, ['pic'])) {
			toast({
				title: 'Please fill in all details.',
				status: 'warning',
				duration: 2000,
				position: 'bottom',
				isClosable: true,
			});

			setLoading(false);
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			toast({
				title: 'Passwords do not match.',
				status: 'warning',
				duration: 2000,
				position: 'bottom',
				isClosable: true,
			});

			setLoading(false);
			return;
		}

		const { confirmPassword, ...payload } = formData;

		const [res, err] = await asyncWrap(axios.post('user/register', payload));

		if (err) {
			console.log(err);
			toast({
				title: 'Something went wrong.',
        description: err.response?.data?.message,
				status: 'warning',
				duration: 2000,
				position: 'bottom',
				isClosable: true,
			});

			setLoading(false);
			return;
		}

		toast({
			title: 'Registration Successfull.',
			status: 'success',
			duration: 2000,
			position: 'bottom',
			isClosable: true,
		});

		localStorage.setItem('loggedUserInfo', JSON.stringify(res.data));
		setToken(res.data.token);
		setLoading(false);
		window.location.reload();
		navigateTo('/chats');
	};

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
