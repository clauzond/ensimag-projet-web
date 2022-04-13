import { useAppStateContext } from '../contexts/AppState';
import { Text, StatusBar, IconButton } from 'native-base';
import React from 'react';
import { users } from '../services/users';
import { storyService } from '../services/story';
import { paragraphService } from '../services/paragraph';
import { FlatList, SafeAreaView, TouchableOpacity, StyleSheet, Button, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PopupComponent } from '../components/popup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoriesComponent } from '../components/stories';

export function Home({ navigation }) {
  const { token, setHistory } = useAppStateContext();
  const [stories, setStories] = React.useState('');

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
    const util = await paragraphService.getParagraph(token, item.id, item.idParagrapheInitial);
    // TODO: la lecture doit reprendre à partir de l'historique
    setHistory([
      { title: util.story.titre, paragraph: util.paragraph, choiceRowArray: util.choiceRowArray },
    ]);
    navigation.navigate('Paragraph', {
      story: item,
      paragraph: util.paragraph,
      choiceRowArray: util.choiceRowArray,
    });
  };

  // Style
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    add_button: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
    },
    separator: {
      marginVertical: 8,
    },
  });

  const renderPopupContent = () => {
    return (
      <View>
        <Button
          title={'My stories'}
          onPress={() => {
            setPopupOpened(false);
            navigation.navigate('UserStories');
          }}
        />
        <View style={styles.separator} />
        <Button
          title={'Disconnect me'}
          onPress={() => {
            setPopupOpened(false);
            setHistory(null);
            AsyncStorage.setItem('@token', token).then(_ => navigation.navigate('Welcome'));
          }}
        />
      </View>
    );
  };

  return (
    //  Main home view
    <SafeAreaView style={styles.container}>
      <StoriesComponent onPressStory={onPressStory} stories={stories} />
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
