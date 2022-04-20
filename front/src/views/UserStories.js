import { useAppStateContext } from '../contexts/AppState';
import { Button, StatusBar } from 'native-base';
import Toast from 'react-native-toast-message';
import React from 'react';
import { storyService } from '../services/story';
import { BackHandler, SafeAreaView, StyleSheet, View } from 'react-native';
import { StoriesComponent } from '../components/stories';
import { PopupComponent } from '../components/popup';

export function UserStories({ navigation, route }) {
  const { token, username } = useAppStateContext();
  const [stories, setStories] = React.useState('');
  const [popupOpened, setPopupOpened] = React.useState(false);
  const [storySelected, setStorySelected] = React.useState('');

  const load = React.useCallback(async () => {
    navigation.setOptions({
      title: 'Customize your stories',
    });

    const storiesFromApi = await storyService.getUserStories(token);
    setStories(storiesFromApi);

    if (route.params !== undefined) {
      const { storyCreated } = route.params;
      if (storyCreated) {
        // Display popup
        Toast.show({
          text1: 'Story created !',
          position: 'bottom',
        });

        // Set Home page display on back press
        const onBackPress = () => {
          navigation.navigate('Home');
          return true;
        };

        // For the top-left back button
        navigation.setOptions({
          headerBackVisible: false,
        });

        // For the hard back button
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }
    }
  }, [navigation, route.params, token]);

  React.useEffect(() => {
    load();
  }, [load]);

  const renderPopupContent = () => {
    return (
      <View>
        <Button
          onPress={() => {
            storyService
              .modifyStory(token, storySelected.id, undefined, !storySelected.estPublique)
              .then(() => {
                setPopupOpened(false);
                load().then(() =>
                  Toast.show({
                    text1: 'Modification saved',
                    position: 'bottom',
                  })
                );
              })
              .catch(() =>
                Toast.show({
                  type: 'error',
                  text1: 'An error has occured',
                  position: 'bottom',
                })
              );
          }}
        >
          {storySelected.estPublique === true ? 'Make story private' : 'Make story public'}
        </Button>
        <View style={styles.separator} />
        <Button
          onPress={() => {
            storyService
              .modifyStory(token, storySelected.id, !storySelected.estOuverte, undefined)
              .then(() => {
                setPopupOpened(false);
                load().then(() =>
                  Toast.show({
                    text1: 'Modification saved',
                    position: 'bottom',
                  })
                );
              })
              .catch(() =>
                Toast.show({
                  type: 'error',
                  text1: 'An error has occured',
                  position: 'bottom',
                })
              );
          }}
        >
          {storySelected.estOuverte === true ? 'Disable modifications' : 'Allow modifications'}
        </Button>
        <View style={styles.separator} />
        {storySelected.idAuteur === username ? (
          <Button
            onPress={async () => {
              const collaboratorListFromApi = await storyService.getCollaborators(
                token,
                storySelected.id
              );
              const formatCollaboratorList = [];
              for (const collaborator of collaboratorListFromApi) {
                formatCollaboratorList.push(collaborator.id);
              }
              navigation.navigate('SetCollaborators', {
                story: storySelected,
                collaborators: formatCollaboratorList,
              });
            }}
          >
            Set collaborators
          </Button>
        ) : null}
        <View style={styles.separator} />
        <Button
          onPress={() => {
            navigation.navigate('SetParagraphs', {
              story: storySelected,
            });
          }}
        >
          Set paragraphs
        </Button>
      </View>
    );
  };

  const onPressStory = async item => {
    setPopupOpened(true);
    setStorySelected(item);
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
      <StoriesComponent onPressStory={onPressStory} stories={stories} />

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
