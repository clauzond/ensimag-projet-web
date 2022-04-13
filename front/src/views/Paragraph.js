import { useAppStateContext } from '../contexts/AppState';
import { View, ScrollView, StatusBar } from 'native-base';
import React, { useRef } from 'react';
import { paragraphService } from '../services/paragraph';
import { StyleSheet } from 'react-native';
import { ParagraphComponent } from '../components/paragraph';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export function Paragraph({ navigation, route }) {
  const { token, history, setHistory } = useAppStateContext();
  const { story, paragraph, choiceRowArray } = route.params;
  const scrollRef = useRef();

  const load = () => {
    navigation.setOptions({ title: story.titre });
  };

  const onPressChoice = async (choiceId, choiceTitle) => {
    const util = await paragraphService.getParagraph(token, story.id, choiceId);
    setHistory([
      ...history,
      { title: choiceTitle, paragraph: util.paragraph, choiceRowArray: util.choiceRowArray },
    ]);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
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

  React.useEffect(() => {
    load();
  }, []);

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
        />
      </ScrollView>
    </View>
  );
}
