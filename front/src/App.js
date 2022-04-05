import React, { useState } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import LoginForm from './components/LoginForm';

const BACKEND = 'http://10.0.2.2:3000';

const App = () => {
	const [compteur, setCompteur] = useState(0);
	const [token, setToken] = useState('');

	async function connect(username, password) {
		fetch(`${BACKEND}/api/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: `${JSON.stringify({ username, password })}`
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
		<>
			<Text>Token is: {token}</Text>
			<LoginForm onConnect={connect} />
		</>
	);
};
export default App;
