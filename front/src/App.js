// import React, { useState } from 'react';
// import { Text, View, Button, StyleSheet } from 'react-native';
// import LoginForm from './components/LoginForm';
//
// const BACKEND = 'http://10.0.2.2:3000';
//
// const App = () => {
// 	const [compteur, setCompteur] = useState(0);
// 	const [token, setToken] = useState('');
//
// 	async function connect(username, password) {
// 		fetch(`${BACKEND}/api/login`, {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: `${JSON.stringify({ username, password })}`
// 		})
// 			.then(response => {
// 				console.log(response);
// 				return response.json();
// 			})
// 			.then(data => {
// 				console.log(data);
// 				console.log(data.data);
// 				setToken(data.data);
// 			})
// 			.catch(error => console.log(error));
// 	}
//
// 	return (
// 		<>
// 			<Text>Token is: {token}</Text>
// 			<LoginForm onConnect={connect} />
// 		</>
// 	);
// };
// export default App;

import React from 'react';

import { Text, View, Button, StyleSheet } from 'react-native';
import { AddIcon, NativeBaseProvider, Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Welcome } from './views/Welcome';
import { Register } from './views/Register';

function HomeScreen() {
	return (
		<View
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
		>
			<Text>Home Screen</Text>
		</View>
	);
}

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NativeBaseProvider>
			{/* needed by native-base for styling */}
			<NavigationContainer>
				{/* react-router navigation */}
				<Stack.Navigator initialRouteName="Welcome">
					<Stack.Screen
						name="Welcome"
						component={Welcome}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Register"
						component={Register}
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="Home" component={HomeScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</NativeBaseProvider>
	);
}
