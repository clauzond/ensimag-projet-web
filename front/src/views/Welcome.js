import React from 'react';
import { Heading, View, Text, Center, Icon, Box } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function Welcome() {
	return (
		<View>
			<Center>
				<Heading>
					<Box>
						<Icon
							as={MaterialCommunityIcons}
							name="book"
							color="coolGray.800"
							size="2xl"
							_dark={{
								color: 'warmGray.50',
							}}
						/>
					</Box>
					A component library for the{' '}
					<Heading color="emerald.400">React Ecosystem</Heading>
				</Heading>
				<Text pt="3" fontWeight="md">
					NativeBase is a simple, modular and accessible component
					library that gives you building blocks to build you React
					applications.
				</Text>
			</Center>
		</View>
	);
}
