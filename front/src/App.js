import React from 'react';
import { NativeBaseProvider, Text, View } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppStateContext, AppStateProvider } from './contexts/AppState';
import { Welcome } from './views/Welcome';
import { Register } from './views/Register';
import { Login } from './views/Login';

function HomeScreen() {
	const { token } = useAppStateContext();
	console.log(token);

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>got token: {token}</Text>
		</View>
	);
}

const Stack = createNativeStackNavigator();

export default function App() {
	const [token, setToken] = React.useState('');

	const load = async () => {
		const tokenFromStorage = await AsyncStorage.getItem('@token');
		if (tokenFromStorage !== '') {
			setToken(tokenFromStorage);
		}
	};
	React.useEffect(() => {
		load();
	}, []);

	return (
		<AppStateProvider value={{ token, setToken }}>
			<NativeBaseProvider>
				{/* needed by native-base for styling */}
				<NavigationContainer>
					{/* react-router navigation */}
					<Stack.Navigator initialRouteName={token === '' ? 'Welcome' : 'Home'}>
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
						<Stack.Screen
							name="Login"
							component={Login}
							options={{ headerShown: false }}
						/>
						<Stack.Screen name="Home" component={HomeScreen} />
					</Stack.Navigator>
				</NavigationContainer>
			</NativeBaseProvider>
		</AppStateProvider>
	);
}
