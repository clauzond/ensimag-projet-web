import { useAppStateContext } from '../contexts/AppState';
import { Flex, View, Text, Icon, Box, Button, ScrollView, StatusBar } from 'native-base';
import React, { useState } from 'react';
import { paragraphService } from '../services/paragraph';
import { StyleSheet } from 'react-native';
import { ParagraphComponent } from '../components/paragraph';

export function Paragraph({ navigation, route }) {
  const { token } = useAppStateContext();
  const { paragraph, setParagraph } = useState();
  const { choiceRowArray, setChoiceRowArray } = useState();
  const { item } = route.params;
  const story = item;

  const load = async () => {
    navigation.setOptions({ title: story.titre });
    const util = await paragraphService.getParagraph(token, story.id, story.ParagrapheInitial.id);

    // setParagraph(util.paragraph);
    // setChoiceRowArray(util.choiceRowArray);
  };

  React.useEffect(() => {
    load();
  }, []);

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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ParagraphComponent
          getStory={() => story}
          getParagraph={() => paragraph}
          getChoiceRowArray={() => choiceRowArray}
        />
      </ScrollView>
    </View>
  );
}
