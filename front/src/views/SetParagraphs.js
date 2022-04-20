import { useAppStateContext } from '../contexts/AppState';
import { Button, IconButton, StatusBar } from 'native-base';
import Toast from 'react-native-toast-message';
import React from 'react';
import { storyService } from '../services/story';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StoriesComponent } from '../components/stories';
import { PopupComponent } from '../components/popup';
import { paragraphService } from '../services/paragraph';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native'

export function SetParagraphs({ navigation, route }) {
  const { token, username } = useAppStateContext();
  const { story } = route.params;
  const [paragraphs, setParagraphs] = React.useState('');
  const [popupParagraphOptionsOpened, setPopupParagraphOptionsOpened] = React.useState(false);
  const [popupAddParagraphOpened, setPopupAddParagraphOpened] = React.useState(false);
  const [paragraphSelected, setParagraphSelected] = React.useState('');
  const isFocused = useIsFocused();

  React.useEffect(() => {
    const load = async () => {
      // TODO: que faire des choix entre 2 paragraphes pré-existants ?
      // TODO: ajouter les choix à la liste des paragraphes
      const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
      setParagraphs(paragraphsFromApi);
      navigation.setOptions({
        title: 'Customize paragraphs',
      });
    };
    
    load();
  }, [isFocused]);

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

  const renderPopupParagraphOptions = () => {
    return (
      <View>
        {paragraphSelected.idRedacteur === username && paragraphSelected.estVerrouille ? (
          <Button
            onPress={async () => {
              setPopupParagraphOptionsOpened(false);
              navigation.navigate('SetParagraph', {
                story: story,
                titlePage: 'Modify paragraph',
                paragraphContent: paragraphSelected.contenu,
                isCreation: false,
                isNewParagraph: false,
                paragraphSelected: paragraphSelected,
              });
            }}
          >
            Update paragraph
          </Button>
        ) : null}
        <View style={styles.separator} />

        {!paragraphSelected.estVerrouille ? (
          <Button
            onPress={async () => {
              try {
                await paragraphService.askToUpdateParagraph(token, story.id, paragraphSelected.id);
                const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
                setParagraphs(paragraphsFromApi);
                setPopupParagraphOptionsOpened(false);
                Toast.show({
                  text1: 'You can now modify this paragraph!',
                  position: 'bottom',
                });
              } catch (e) {
                setPopupParagraphOptionsOpened(false);
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
        ) : null}
        <View style={styles.separator} />
        {paragraphSelected.idRedacteur === username ? (
          <Button
            onPress={async () => {
              try {
                await paragraphService.cancelModification(token, story.id, paragraphSelected.id);
                const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
                setParagraphs(paragraphsFromApi);
                setPopupParagraphOptionsOpened(false);
                Toast.show({
                  text1: 'Paragraph was sucessfully deleted',
                  position: 'bottom',
                });
              } catch (e) {
                setPopupParagraphOptionsOpened(false);
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
                setPopupParagraphOptionsOpened(false);
                Toast.show({
                  text1: 'Paragraph was sucessfully deleted',
                  position: 'bottom',
                });
              } catch (e) {
                setPopupParagraphOptionsOpened(false);
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

  const renderPopupAddParagraph = () => {
    return (
      <View>
        <Button
          onPress={() => {
            navigation.navigate('SetParagraph', {
              story: story,
              titlePage: 'Create paragraph',
              paragraphContent: '',
              isCreation: true,
              isNewParagraph: true,
            });
          }}
        >
          Create paragraph
        </Button>
        <View style={styles.separator} />
        <Button
          onPress={() => {
            navigation.navigate('SetParagraph', {
              story: story,
              titlePage: 'Create choice',
              paragraphContent: '',
              isCreation: true,
              isNewParagraph: false,
            });
          }}
        >
          Create choice
        </Button>
      </View>
    );
  };

  const onPressStory = async item => {
    setPopupParagraphOptionsOpened(true);
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
    addButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StoriesComponent
        onPressStory={onPressStory}
        stories={paragraphs}
        getSpecialColor={getSpecialColor}
      />

      <IconButton
        style={styles.addButton}
        onPress={() => setPopupAddParagraphOpened(true)}
        size={'lg'}
        variant="solid"
        colorScheme="primary"
        _icon={{
          as: MaterialIcons,
          name: 'add',
        }}
      />

      {/*Paragraph options popup*/}
      <PopupComponent
        visible={popupParagraphOptionsOpened}
        onClose={() => setPopupParagraphOptionsOpened(false)}
        children={renderPopupParagraphOptions}
      />

      {/*Add paragraph popup*/}
      <PopupComponent
        visible={popupAddParagraphOpened}
        onClose={() => setPopupAddParagraphOpened(false)}
        children={renderPopupAddParagraph}
      />
      <Toast />
    </SafeAreaView>
  );
}
