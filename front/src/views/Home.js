import { useAppStateContext } from '../contexts/AppState';
import axios from 'axios';
import { Text, Center } from 'native-base';
import React from 'react';
import { BACKEND } from '../globals';

export function Home() {
  const { token } = useAppStateContext();
  const [username, setUsername] = React.useState('');
  console.log(token);

  const load = async () => {
    try {
      const response = await axios.get(`${BACKEND}/api/whoami`, {
        headers: { 'x-access-token': token },
      });
      setUsername(response.data.data);
    } catch (e) {
      // ignore error, not connected
    }
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
