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
	Text,
	Spinner,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND } from '../globals';
import { useAppStateContext } from '../contexts/AppState';

export function Login({ navigation }) {
	const { setToken } = useAppStateContext();
	const [formData, setData] = React.useState({});
	const [errors, setErrors] = React.useState({});

	// Password box state and functions
	const [show, setShow] = React.useState(false);
	const handleClick = () => setShow(!show);

	// Loading indication
	const [loading, setLoading] = React.useState(false);

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

		setErrors({});
		return true;
	};

	// Connect to the actual backend
	async function login(username, password) {
		try {
			setLoading(true);
			let response = await axios.post(`${BACKEND}/api/login`, {
				username,
				password,
			});
			const token = response.data.data;

			// save our token on the device: the user is permanently logged in now
			await AsyncStorage.setItem('@token', token);
			setToken(token);

			setLoading(false);

			navigation.navigate('Home');
		} catch (e) {
			setLoading(false);
			setErrors({
				...errors,
				backend:
					e.response?.data?.message ?? 'Erreur inconnue. Veuillez réessayer.',
			});
		}
	}

	const onSubmit = async () => {
		if (!validate()) {
			return;
		}
		await login(formData.username, formData.password);
	};

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
									<FormControl.Label>Identifiant</FormControl.Label>
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
								{loading && (
									<HStack space={2} justifyContent="center">
										<Spinner accessibilityLabel="Waiting for response" />
										<Heading color="primary.500" fontSize="md">
											Loading
										</Heading>
									</HStack>
								)}
								{'backend' in errors && (
									<Text color="error.600">{errors.backend}</Text>
								)}
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
					Se connecter
				</Button>
			</Flex>
		</Flex>
	);
}
