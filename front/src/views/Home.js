import { useAppStateContext } from '../contexts/AppState';
import axios from 'axios';
import { Text, Center } from 'native-base';
import React from 'react';
import { BACKEND } from '../globals';
import { users } from '../services/users';

export function Home() {
  const { token } = useAppStateContext();
  const [username, setUsername] = React.useState('');
  console.log(token);

  const load = async () => {
    const usernameFromApi = await users.whoami(token);
    setUsername(usernameFromApi);
  };
  React.useEffect(() => {
    load();
  });

  return (
    <Center>
      {username === '' ? <Text bold>Not connected</Text> : <Text>Connected as {username}</Text>}
      <Text>got token: {token}</Text>
    </Center>
  );
}
