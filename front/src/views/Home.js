import { useAppStateContext } from '../contexts/AppState';
import { Button, IconButton, StatusBar } from 'native-base';
import React from 'react';
import { users } from '../services/users';
import { storyService } from '../services/story';
import { paragraphService } from '../services/paragraph';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PopupComponent } from '../components/popup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoriesComponent } from '../components/stories';
import { historyService } from '../services/history';

export function Home({ navigation }) {
  const { token, setHistory, setUsername } = useAppStateContext();
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
      setUsername(username);
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
    // Set up history
    const savedHistory = token !== '' ? await historyService.getHistory(token, item.id) : null;
    let toSetHistory = [];
    if (savedHistory === null || savedHistory.length === 0) {
      const util = await paragraphService.getPublicParagraph(
        token,
        item.id,
        item.idParagrapheInitial
      );
      toSetHistory.push({
        title: util.story.titre,
        paragraph: util.paragraph,
        choiceRowArray: util.choiceRowArray,
      });
    } else {
      for (const obj of savedHistory) {
        try {
          const util = await paragraphService.getPublicParagraph(token, item.id, obj.id);
          toSetHistory.push({
            title: obj.title,
            paragraph: util.paragraph,
            choiceRowArray: util.choiceRowArray,
          });
        } catch {
          // History is compromised: reset history
          console.log('HISTORY COMPROMISED; RESETTING');
          const util = await paragraphService.getPublicParagraph(
            token,
            item.id,
            item.idParagrapheInitial
          );
          await historyService.clearHistory(token, item.id);
          toSetHistory = [
            {
              title: util.story.titre,
              paragraph: util.paragraph,
              choiceRowArray: util.choiceRowArray,
            },
          ];
          break;
        }
      }
    }

    setHistory(toSetHistory);

    // Resume lecture to the last item of history
    navigation.navigate('Paragraph', {
      story: item,
      paragraph: toSetHistory[toSetHistory.length - 1].paragraph,
      choiceRowArray: toSetHistory[toSetHistory.length - 1].choiceRowArray,
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
          onPress={() => {
            setPopupOpened(false);
            navigation.navigate('UserStories');
          }}
        >
          My stories
        </Button>
        <View style={styles.separator} />
        <Button
          colorScheme={'secondary'}
          onPress={() => {
            setPopupOpened(false);
            setHistory(null);
            AsyncStorage.removeItem('@token').then(_ => navigation.navigate('Welcome'));
          }}
        >
          Disconnect me
        </Button>
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
          onPress={() => navigation.navigate('StoryCreation')}
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
