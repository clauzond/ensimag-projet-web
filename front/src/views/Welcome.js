import React from 'react';
import {
	Flex,
	Heading,
	View,
	Text,
	Center,
	Icon,
	Box,
	Button,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function Welcome() {
	return (
		<View>
			<Center>
				<Flex
					h="100%"
					alignItems="center"
					justifyContent="space-between"
					py="40px"
				>
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
						<Heading color="emerald.400">Herobook</Heading>
					</Flex>
					<Box>
						<Button onPress={() => console.log('hello world')}>
							S'inscrire
						</Button>
						<Button>Se connecter</Button>
					</Box>
					<Box>
						<Text>Continuer en tant qu'invité</Text>
					</Box>
				</Flex>
			</Center>
		</View>
	);
}
