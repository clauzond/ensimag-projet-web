import React from 'react';
import { Flex, Heading, View, Text, Icon, Box, Button } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function Welcome({ navigation }) {
	return (
		<View>
			<Flex h="100%" justify="space-between" align="center" py={4}>
				<Box />
				<Flex alignItems="center">
					<Icon
						as={MaterialCommunityIcons}
						name="book"
						color="coolGray.800"
						size="2xl"
						_dark={{
							color: 'warmGray.50',
						}}
					/>
					<Heading fontSize="4xl" color="primary.400">
						Mon App
					</Heading>
				</Flex>
				<Box p="2" w="90%" py="8" colorScheme="secondary">
					<Button mt="2" onPress={() => navigation.navigate('Register')}>
						Inscription
					</Button>
					<Button
						mt="2"
						onPress={() => navigation.navigate('Login')}
						colorScheme="secondary"
					>
						Se connecter
					</Button>
					<Text mt={2} textAlign="center">
						Continuer en tant qu'invité
					</Text>
				</Box>
			</Flex>
		</View>
	);
}