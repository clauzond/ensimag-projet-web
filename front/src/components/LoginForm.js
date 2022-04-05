import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Button } from 'react-native';

const LoginForm = props => {
	const [login, setlogin] = useState('clauzond');
	const [password, setPassword] = useState('clauzonmdp');

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				onChangeText={setlogin}
				value={login}
				placeholder="Login"
			/>
			<TextInput
				style={styles.input}
				secureTextEntry={true}
				onChangeText={setPassword}
				value={password}
				placeholder="Password"
			/>
			<Button
				title="Se connecter"
				color="blue"
				onPress={() => props.onConnect(login, password)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	input: { height: 40, margin: 12, borderWidth: 1 }
});
export default LoginForm;
