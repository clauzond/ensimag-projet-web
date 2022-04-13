import { useAppStateContext } from '../contexts/AppState';
import { StatusBar } from 'native-base';
import React from 'react';
import { users } from '../services/users';
import { storyService } from '../services/story';
import { paragraphService } from '../services/paragraph';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StoriesComponent } from '../components/stories';

export function UserStories({ navigation }) {
  const { token, setHistory } = useAppStateContext();
  const [stories, setStories] = React.useState('');

  const load = async () => {
    const storiesFromApi = await storyService.getUserStories(token);
    setStories(storiesFromApi);
  };

  const header = async () => {
    if (token !== '') {
      const username = await users.whoami(token);
      // Set header buttons
      navigation.setOptions({
        title: `Your stories - ${username}`,
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
  });

  return (
    //  Main home view
    <SafeAreaView style={styles.container}>
      <StoriesComponent onPressStory={onPressStory} stories={stories} />
    </SafeAreaView>
  );
}
