import { useAppStateContext } from '../contexts/AppState';
import { Button, StatusBar } from 'native-base';
import Toast from 'react-native-toast-message';
import React from 'react';
import { storyService } from '../services/story';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StoriesComponent } from '../components/stories';
import { PopupComponent } from '../components/popup';

export function UserStories({ navigation }) {
  const { token, username } = useAppStateContext();
  const [stories, setStories] = React.useState('');
  const [popupOpened, setPopupOpened] = React.useState(false);
  const [storySelected, setStorySelected] = React.useState('');

  const load = async () => {
    const storiesFromApi = await storyService.getUserStories(token);
    setStories(storiesFromApi);
    navigation.setOptions({
      title: 'Customize your stories',
    });
  };

  React.useEffect(() => {
    load();
  }, []);

  const renderPopupContent = () => {
    return (
      <View>
        <Button
          onPress={() => {
            storyService
              .modifyStory(token, storySelected.id, undefined, !storySelected.estPublique)
              .then(_ => {
                setPopupOpened(false);
                load().then(_ =>
                  Toast.show({
                    text1: 'Modification saved',
                    position: 'bottom',
                  })
                );
              })
              .catch(_ =>
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
              .then(_ => {
                setPopupOpened(false);
                load().then(_ =>
                  Toast.show({
                    text1: 'Modification saved',
                    position: 'bottom',
                  })
                );
              })
              .catch(_ =>
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
            onPress={() =>
              navigation.navigate('SetCollaborators', {
                story: storySelected,
              })
            }
          >
            Set collaborators
          </Button>
        ) : null}
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
