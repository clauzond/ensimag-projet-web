import { useAppStateContext } from '../contexts/AppState';
import { Text, Center } from 'native-base';
import React from 'react';
import { users } from '../services/users';
import { history } from '../services/history';

export function Home() {
  const { token } = useAppStateContext();
  const [username, setUsername] = React.useState('');
  const [stories, setStories] = React.useState('');
  console.log(token);

  const load = async () => {
    const usernameFromApi = await users.whoami(token);
    setUsername(usernameFromApi);
    // const storiesFromApi = await history.getPublicAuthentifiedStories(token);
    // setStories(storiesFromApi);
  };

  React.useEffect(() => {
    load();
  });

  // console.log(stories);

  return (
    <Center>
      {username === '' ? <Text bold>Not connected</Text> : <Text>Connected as {username}</Text>}
      <Text>got token: {token}</Text>
    </Center>
  );
}
