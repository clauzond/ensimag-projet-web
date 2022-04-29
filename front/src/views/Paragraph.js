import { useAppStateContext } from '../contexts/AppState';
import { ScrollView, StatusBar, View } from 'native-base';
import React, { useRef } from 'react';
import { paragraphService } from '../services/paragraph';
import { BackHandler, StyleSheet } from 'react-native';
import { ParagraphComponent } from '../components/paragraph';
import { useFocusEffect } from '@react-navigation/native';
import { historyService } from '../services/history';
import Toast from 'react-native-toast-message';

export function Paragraph({ navigation, route }) {
  const { token, history, setHistory } = useAppStateContext();
  const { story, paragraph, choiceRowArray } = route.params;
  const scrollRef = useRef();

  const onPressChoice = async (choiceId, choiceTitle) => {
    const util = await paragraphService.getPublicParagraph(token, story.id, choiceId);

    scrollRef.current?.scrollTo({ y: 0, animated: false });

    // Choice loop: no need to change view
    if (util.paragraph.id === paragraph.id) {
      return;
    }

    setHistory([
      ...history,
      { title: choiceTitle, paragraph: util.paragraph, choiceRowArray: util.choiceRowArray },
    ]);
    navigation.setParams({
      paragraph: util.paragraph,
      choiceRowArray: util.choiceRowArray,
    });
  };

  const onPressHistory = async historyIndex => {
    setHistory(history.slice(0, historyIndex + 1));
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    navigation.setParams({
      paragraph: history[historyIndex].paragraph,
      choiceRowArray: history[historyIndex].choiceRowArray,
    });
  };

  const onPressSave = async () => {
    const arrayParagraph = history.map(obj => {
      return { id: obj.paragraph.id, title: obj.title };
    });

    await historyService.saveHistory(token, story.id, arrayParagraph);

    Toast.show({
      text1: 'History saved',
      position: 'bottom',
    });
  };

  React.useEffect(() => {
    const load = () => {
      navigation.setOptions({ title: story.titre });
    };
    load();
  }, [navigation, story.titre]);

  // Removes the event listener when exiting the view
  // see: https://reactnavigation.org/docs/custom-android-back-button-handling/
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    baseText: {
      fontFamily: 'Roboto',
      fontSize: 18,
    },
    scrollView: {
      marginHorizontal: 20,
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container} onTouchStart={() => {}}>
      <ScrollView style={styles.scrollView} ref={scrollRef}>
        <ParagraphComponent
          token={token}
          story={story}
          paragraph={paragraph}
          choiceRowArray={choiceRowArray}
          history={history}
          onPressChoice={onPressChoice}
          onPressHistory={onPressHistory}
          onPressSave={onPressSave}
        />
      </ScrollView>
      <Toast />
    </View>
  );
}
