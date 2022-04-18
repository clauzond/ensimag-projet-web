import { useAppStateContext } from '../contexts/AppState';
import { Button, StatusBar } from 'native-base';
import Toast from 'react-native-toast-message';
import React from 'react';
import { storyService } from '../services/story';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StoriesComponent } from '../components/stories';
import { PopupComponent } from '../components/popup';
import { paragraphService } from '../services/paragraph';

export function SetParagraphs({ navigation, route }) {
  const { token, username } = useAppStateContext();
  const { story } = route.params;
  const [paragraphs, setParagraphs] = React.useState('');
  const [popupOpened, setPopupOpened] = React.useState(false);
  const [paragraphSelected, setParagraphSelected] = React.useState('');

  React.useEffect(() => {
    const load = async () => {
      const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
      setParagraphs(paragraphsFromApi);

      // TODO: button to create paragraph + popup "Paragraph created"
      // TODO: show in another color the paragraph you are working on (estVerrouille + idRedacteur===username)
      navigation.setOptions({
        title: 'Customize paragraphs',
      });
    };

    load();
  }, [navigation, story.id, token]);

  const getSpecialColor = paragraph => {
    const workingOn = '#ffc2c2';
    const authorOf = '#a7ebc6';
    const free = '#f9c2ff';

    if (paragraph.estVerrouille && paragraph.idRedacteur === username) {
      return workingOn;
    } else if (paragraph.idRedacteur === username) {
      return authorOf;
    }
    return free;
  };

  const renderPopupContent = () => {
    return (
      <View>
        {paragraphSelected.idRedacteur === username ? (
          <Button
            onPress={async () => {
              // TODO: view to modify paragraph
              setPopupOpened(false);
              Toast.show({
                type: 'error',
                text1: 'TODO',
                position: 'bottom',
              });
            }}
          >
            Update paragraph...
          </Button>
        ) : null}
        <View style={styles.separator} />
        <Button
          onPress={async () => {
            try {
              await paragraphService.askToUpdateParagraph(token, story.id, paragraphSelected.id);
              const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
              setParagraphs(paragraphsFromApi);
              setPopupOpened(false);
              Toast.show({
                text1: 'You can now modify this paragraph!',
                position: 'bottom',
              });
            } catch (e) {
              setPopupOpened(false);
              Toast.show({
                type: 'error',
                text1: e,
                position: 'bottom',
              });
            }
          }}
        >
          Ask to update paragraph
        </Button>
        <View style={styles.separator} />
        {paragraphSelected.idRedacteur === username ? (
          <Button
            onPress={async () => {
              try {
                await paragraphService.cancelModification(token, story.id, paragraphSelected.id);
                const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
                setParagraphs(paragraphsFromApi);
                setPopupOpened(false);
                Toast.show({
                  text1: 'Paragraph was sucessfully deleted',
                  position: 'bottom',
                });
              } catch (e) {
                setPopupOpened(false);
                Toast.show({
                  type: 'error',
                  text1: e,
                  position: 'bottom',
                });
              }
            }}
          >
            Remove yourself from redaction
          </Button>
        ) : null}
        <View style={styles.separator} />
        {paragraphSelected.idRedacteur === username ? (
          <Button
            onPress={async () => {
              try {
                await paragraphService.deleteParagraph(token, story.id, paragraphSelected.id);
                const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
                setParagraphs(paragraphsFromApi);
                setPopupOpened(false);
                Toast.show({
                  text1: 'Paragraph was sucessfully deleted',
                  position: 'bottom',
                });
              } catch (e) {
                setPopupOpened(false);
                Toast.show({
                  type: 'error',
                  text1: e,
                  position: 'bottom',
                });
              }
            }}
          >
            Delete paragraph
          </Button>
        ) : null}
      </View>
    );
  };

  const onPressStory = async item => {
    setPopupOpened(true);
    setParagraphSelected(item);
  };

  // Style
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    separator: {
      marginVertical: 8,
    },
  });

  return (
    //  Main user stories
    <SafeAreaView style={styles.container}>
      <StoriesComponent
        onPressStory={onPressStory}
        stories={paragraphs}
        getSpecialColor={getSpecialColor}
      />

      {/*Modify story popup*/}
      <PopupComponent
        visible={popupOpened}
        onClose={() => setPopupOpened(false)}
        children={renderPopupContent}
      />
      <Toast />
    </SafeAreaView>
  );
}
