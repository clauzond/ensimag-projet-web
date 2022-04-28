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
import { useIsFocused } from '@react-navigation/native';

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
      const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
      setParagraphs(paragraphsFromApi);
      navigation.setOptions({
        title: 'Customize paragraphs',
      });
    };

    load();
  }, [isFocused, token, story.id, navigation]);

  const getSpecialColor = paragraph => {
    const workingOn = '#f9ffc2';
    const authorOf = '#a7ebc6';
    const notAllowed = '#ffc2c2';
    const free = '#f9c2ff';

    if (paragraph.estVerrouille && paragraph.idRedacteur === username) {
      return workingOn;
    } else if (paragraph.idRedacteur === username) {
      return authorOf;
    } else if (paragraph.idRedacteur !== null && paragraph.idRedacteur !== username) {
      return notAllowed;
    }

    return free;
  };

  const renderPopupParagraphOptions = () => {
    return (
      <View>
        <Button
          onPress={async () => {
            try {
              // If paragraph is not locked, lock it before modifying
              if (!paragraphSelected.estVerrouille) {
                await paragraphService.askToUpdateParagraph(token, story.id, paragraphSelected.id);
                const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
                setParagraphs(paragraphsFromApi);
              }
              setPopupParagraphOptionsOpened(false);
              navigation.navigate('SetParagraph', {
                story: story,
                titlePage: 'Modify paragraph',
                paragraphContent: paragraphSelected.contenu,
                isCreation: false,
                isNewParagraph: true,
                paragraphSelected: paragraphSelected,
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
          {paragraphSelected.idRedacteur === username && paragraphSelected.estVerrouille
            ? 'Update paragraph'
            : 'Lock and update paragraph'}
        </Button>

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
                  text1: 'You are not the author of this paragraph anymore',
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
                  text1: 'Paragraph was successfully deleted',
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
    setParagraphSelected(item);
    if (paragraphSelected.idRedacteur !== null && paragraphSelected.idRedacteur !== username) {
      Toast.show({
        type: 'error',
        text1: 'You are not allowed to modify this paragraph',
        position: 'bottom',
      });
    } else {
      setPopupParagraphOptionsOpened(true);
    }
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
        testID={'addParagraphButton'}
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
        children={renderPopupParagraphOptions(paragraphSelected)}
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
