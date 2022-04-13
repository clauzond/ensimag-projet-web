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
    navigation.setOptions({
      title: 'Custom your stories',
    });
  };

  React.useEffect(() => {
    load();
  }, []);

  const onPressStory = async item => {
    // TODO: permettre la modification de l'histoire
    const util = await paragraphService.getParagraph(token, item.id, item.idParagrapheInitial);
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
