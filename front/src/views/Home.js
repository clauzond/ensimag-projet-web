import { useAppStateContext } from '../contexts/AppState';
import { Text, StatusBar, IconButton } from 'native-base';
import React from 'react';
import { users } from '../services/users';
import { storyService } from '../services/story';
import { paragraphService } from '../services/paragraph';
import { FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PopupComponent } from '../components/popup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Home({ navigation }) {
  const { token, setHistory } = useAppStateContext();
  const [stories, setStories] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(null);

  const [popupOpened, setPopupOpened] = React.useState(false);

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
              onPress={() => setPopupOpened(true)}
            />
          </TouchableOpacity>
        ),
        headerBackVisible: false,
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
    setHistory([util.paragraph.id]);
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
    popup: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    item_popup: {
      fontSize: 20,
      fontWeight: 'bold',
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

  const renderPopupContent = () => {
    return (
      <TouchableOpacity style={styles.popup}>
        <Text
          onPress={() => {
            // TODO: display user stories
            // navigation.navigate('MyStories');
          }}
          style={styles.item_popup}
        >
          My stories
        </Text>
        <Text
          onPress={() => {
            setHistory(null);
            AsyncStorage.setItem('@token', token).then(_ => navigation.navigate('Welcome'));
          }}
          style={[
            styles.item_popup,
            {
              borderTopColor: 'black',
              borderTopWidth: 1,
              paddingTop: 15,
              marginTop: 15,
            },
          ]}
        >
          Disconnect me
        </Text>
      </TouchableOpacity>
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
      <PopupComponent
        visible={popupOpened}
        onClose={() => setPopupOpened(false)}
        children={renderPopupContent}
      />
    </SafeAreaView>
  );
}
