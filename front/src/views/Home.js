import { useAppStateContext } from '../contexts/AppState';
import { Text, StatusBar, IconButton } from 'native-base';
import React from 'react';
import { users } from '../services/users';
import { storyService } from '../services/story';
import { paragraphService } from '../services/paragraph';
import { FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Popup from 'react-native-easypopup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Home({ navigation }) {
  const { token, setHistory } = useAppStateContext();
  const [stories, setStories] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(null);

  const [state, setState] = React.useState(false);

  const load = async () => {
    if (token !== '') {
      // Authentified user case
      const storiesFromApi = await storyService.getPublicAuthentifiedStories(token);
      setStories(storiesFromApi);
    } else {
      // Guest user case
      const storiesFromApi = await storyService.getPublicStories();
      setStories(storiesFromApi);
    }
  };

  const header = async () => {
    if (token !== '') {
      const username = await users.whoami(token);
      // Set header buttons
      navigation.setOptions({
        title: `Home - ${username}`,
        headerRight: () => (
          <TouchableOpacity>
            <IconButton
              size={'lg'}
              _icon={{
                as: MaterialIcons,
                name: 'more-vert',
              }}
              onPress={() => setState(true)}
            />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity>
            <IconButton
              size={'lg'}
              _icon={{
                as: MaterialIcons,
                name: 'menu',
              }}
              onPress={() => {
                //TODO: display lateral menu
              }}
            />
          </TouchableOpacity>
        ),
      });
    }
  };

  React.useEffect(() => {
    load().then(_ => header());
  }, []);

  const onPressStory = async item => {
    setSelectedId(item.id);
    const util = await paragraphService.getParagraph(token, item.id, item.ParagrapheInitial.id);
    // TODO: la lecture doit reprendre à partir de l'historique
    setHistory([{ title: util.story.titre, paragraph: util.paragraph, choiceRowArray: util.choiceRowArray }]);
    navigation.navigate('Paragraph', {
      story: item,
      paragraph: util.paragraph,
      choiceRowArray: util.choiceRowArray,
    });
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
    add_button: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
    },
  });

  const Item = ({ item, onPress, backgroundColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text>{item.titre}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = '#f9c2ff';
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
    //  Main home view
    <SafeAreaView style={styles.container}>
      <FlatList
        data={stories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
      {token !== '' && (
        <IconButton
          style={styles.add_button}
          hide
          size={'lg'}
          variant="solid"
          colorScheme="primary"
          _icon={{
            as: MaterialIcons,
            name: 'add',
          }}
        />
      )}

      {/*Disconnect popup*/}
      <Popup
        showpopup={state}
        type="alert"
        semitransparent={false}
        animation={'fade'}
        onPress={() => setState({ showpopup: !state })}
        contenttext={'Do you want to disconnect ?'}
        acceptbuttontitle={'OK'}
        cancelbuttontitle={'Cancel'}
        confirmaction={() => {
          setHistory(null);
          AsyncStorage.setItem('@token', token).then(_ => navigation.navigate('Welcome'));
        }}
        cancelaction={() => {
          setState(false);
        }}
      />
    </SafeAreaView>
  );
}
