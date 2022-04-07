import React from 'react';
import {
	Flex,
	HStack,
	VStack,
	Heading,
	Icon,
	Box,
	Button,
	Center,
	FormControl,
	Input,
	ScrollView,
	WarningOutlineIcon,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

export function Register({ navigation }) {
	const [formData, setData] = React.useState({});
	const [errors, setErrors] = React.useState({});
	const [token, setToken] = React.useState('');

	// Password box state and functions
	const [show, setShow] = React.useState(false);
	const handleClick = () => setShow(!show);

	// Validation for the entire form
	const validate = () => {
		// Validate username
		if (formData.username == null || formData.username === '') {
			setErrors({
				...errors,
				username: "Le nom d'utilisateur est nécessaire",
			});
			return false;
		}

		// Validate password
		if (formData.password == null || formData.password === '') {
			setErrors({
				...errors,
				password: 'Le mot de passe est nécessaire',
			});
			return false;
		}
		if (formData.password.length < 6) {
			setErrors({
				...errors,
				password: 'Le mot de passe doit faire au moins 6 charactères',
			});
			return false;
		}
		if (formData.password.length > 64) {
			setErrors({
				...errors,
				password: 'Le mot de passe doit faire au plus 64 charactères',
			});
			return false;
		}

		// Validate pasword verification
		if (formData.password !== formData.passwordVerify) {
			setErrors({
				...errors,
				passwordVerify: 'Les deux mots de passe sont différents',
			});
			return false;
		}

		// Form OK
		setErrors({});
		return true;
	};

	const onSubmit = async () => {
		if (!validate()) {
			console.log('Validation Failed');
			return;
		}
		console.log('stuff is now validated');
		await register(formData.username, formData.password);
	};

	// Connect to the actual backend
	const BACKEND = 'http://10.0.2.2:3000';
	async function register(username, password) {
		fetch(`${BACKEND}/api/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: `${JSON.stringify({ username, password })}`,
		})
			.then(response => {
				console.log(response);
				return response.json();
			})
			.then(data => {
				console.log(data);
				console.log(data.data);
				setToken(data.data);
			})
			.catch(error => console.log(error));
	}

	return (
		<Flex h="100%">
			<ScrollView>
				<Flex justify="space-between" align="center" pt={8}>
					<Box />
					<HStack space={12} alignItems="center">
						<Icon
							as={MaterialCommunityIcons}
							name="book"
							color="coolGray.800"
							size="2xl"
							_dark={{
								color: 'warmGray.50',
							}}
							fontWeight="semibold"
						/>
						<Heading fontSize="4xl" color="primary.400">
							Mon App
						</Heading>
					</HStack>
					<Center w="100%">
						<Box safeArea p="2" w="90%" maxW="290" py="8">
							<VStack space={3} mt="5">
								<FormControl isRequired isInvalid={'username' in errors}>
									<FormControl.Label>Nom d'utilisateur</FormControl.Label>
									<Input
										placeholder="clauzond"
										onChangeText={value =>
											setData({
												...formData,
												username: value,
											})
										}
									/>
									{'username' in errors && (
										<FormControl.ErrorMessage
											leftIcon={<WarningOutlineIcon size="xs" />}
										>
											{errors.username}
										</FormControl.ErrorMessage>
									)}
								</FormControl>
								<FormControl isRequired isInvalid={'password' in errors}>
									<FormControl.Label>Mot de passe</FormControl.Label>
									<Box alignItems="center">
										<Input
											type={show ? 'text' : 'password'}
											onChangeText={value =>
												setData({
													...formData,
													password: value,
												})
											}
											InputRightElement={
												<Button
													size="xs"
													rounded="none"
													w="1/6"
													h="full"
													onPress={handleClick}
												>
													{show ? (
														<Icon
															as={MaterialCommunityIcons}
															name="eye-off"
															color="white"
															size="sm"
														/>
													) : (
														<Icon
															as={MaterialCommunityIcons}
															name="eye"
															color="white"
															size="sm"
														/>
													)}
												</Button>
											}
											placeholder="Password"
										/>
									</Box>
									{'password' in errors ? (
										<FormControl.ErrorMessage
											leftIcon={<WarningOutlineIcon size="xs" />}
										>
											{errors.password}
										</FormControl.ErrorMessage>
									) : (
										<FormControl.HelperText
											_text={{
												fontSize: 'xs',
											}}
										>
											Le mot de passe doit faire au moins 6 charactères.
										</FormControl.HelperText>
									)}
								</FormControl>
								<FormControl isRequired isInvalid={'passwordVerify' in errors}>
									<FormControl.Label>
										Confirmer le mot de passe
									</FormControl.Label>
									<Input
										type="password"
										onChangeText={value =>
											setData({
												...formData,
												passwordVerify: value,
											})
										}
									/>
									{'passwordVerify' in errors && (
										<FormControl.ErrorMessage
											leftIcon={<WarningOutlineIcon size="xs" />}
										>
											{errors.passwordVerify}
										</FormControl.ErrorMessage>
									)}
								</FormControl>
							</VStack>
						</Box>
					</Center>
				</Flex>
			</ScrollView>
			<Flex pb={4} px={4} pt={1} direction="row" justify="space-between" mt={5}>
				<Button
					colorScheme="secondary"
					onPress={() => navigation.navigate('Welcome')}
				>
					Retour
				</Button>
				<Button colorScheme="primary" onPress={onSubmit}>
					S'inscrire
				</Button>
			</Flex>
		</Flex>
	);
}
