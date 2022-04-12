import { useAppStateContext } from '../contexts/AppState';
import { Text, Center, StatusBar } from 'native-base';
import React, { useState } from 'react';
import { users } from '../services/users';
import { storyService } from '../services/story';
import { FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';

export function Home({ navigation }) {
  const { token } = useAppStateContext();
  const [username, setUsername] = React.useState('');
  const [stories, setStories] = React.useState('');
  const [selectedId, setSelectedId] = useState(null);

  const load = async () => {
    if (token !== '') {
      // Authentified user case
      const usernameFromApi = await users.whoami(token);
      setUsername(usernameFromApi);
      const storiesFromApi = await storyService.getPublicAuthentifiedStories(token);
      setStories(storiesFromApi);
    } else {
      // Guest user case
      const storiesFromApi = await storyService.getPublicStories();
      setStories(storiesFromApi);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const onPressStory = (item) => {
      setSelectedId(item.id);
      navigation.navigate('Paragraph', { item: item });
  };

  // List style
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
  });

  const Item = ({ item, onPress, backgroundColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text>{item.titre}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => onPressStory(item)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={stories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
}
