import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppStateProvider } from './contexts/AppState';
import { Welcome } from './views/Welcome';
import { Register } from './views/Register';
import { Login } from './views/Login';
import { Home } from './views/Home';
import { CreateStory } from './views/CreateStory';
import { Paragraph } from './views/Paragraph';
import { UserStories } from './views/UserStories';
import { SetCollaborators } from './views/SetCollaborators';
import { SetParagraphs } from './views/SetParagraphs';
import { SetParagraph } from './views/SetParagraph';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = React.useState('');
  const [history, setHistory] = React.useState([]);
  const [username, setUsername] = React.useState('');

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
    <AppStateProvider value={{ token, setToken, history, setHistory, username, setUsername }}>
      <NativeBaseProvider>
        {/* needed by native-base for styling */}
        <NavigationContainer>
          {/* react-router navigation */}
          <Stack.Navigator initialRouteName={token === '' ? 'Welcome' : 'Home'}>
            {/* skip the initial welcome screen if a token is already on the device */}
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="StoryCreation" component={CreateStory} />
            <Stack.Screen name="Paragraph" component={Paragraph} />
            <Stack.Screen name="UserStories" component={UserStories} />
            <Stack.Screen name="SetCollaborators" component={SetCollaborators} />
            <Stack.Screen name="SetParagraphs" component={SetParagraphs} />
            <Stack.Screen name="SetParagraph" component={SetParagraph} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </AppStateProvider>
  );
}
