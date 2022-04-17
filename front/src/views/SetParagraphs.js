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

  const load = async () => {
    const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
    setParagraphs(paragraphsFromApi);

    // TODO: button to create paragraph + popup "Paragraph created"
    // TODO: show in another color the paragraph you are working on (estVerrouille + idRedacteur===usernaùe)

    navigation.setOptions({
      title: 'Customize paragraphs',
    });
  };

  React.useEffect(() => {
    load();
  }, []);

  const renderPopupContent = () => {
    return (
      <View>
        {paragraphSelected.idRedacteur === username ? (
          <Button
            onPress={async () => {
              // TODO: view to modify paragraph
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
      <StoriesComponent onPressStory={onPressStory} stories={paragraphs} />

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
