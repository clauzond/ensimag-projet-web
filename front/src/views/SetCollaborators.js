import { useAppStateContext } from '../contexts/AppState';
import { Button, StatusBar } from 'native-base';
import React from 'react';
import { users } from '../services/users';
import { SafeAreaView, StyleSheet } from 'react-native';
import { MultiSelectComponent } from '../components/multiSelect';
import { storyService } from '../services/story';
import Toast from 'react-native-toast-message';

export function SetCollaborators({ navigation, route }) {
  const { token } = useAppStateContext();
  const { story, collaborators } = route.params;

  const [userList, setUserList] = React.useState([]);
  const [newCollaboratorsList, setNewCollaboratorsList] = React.useState();

  React.useEffect(() => {
    const load = async () => {
      const userListFromApi = await users.userList(token);
      const formatUserList = [];
      for (const user of userListFromApi) {
        formatUserList.push({ id: user.id, name: user.id });
      }
      setUserList(formatUserList);

      navigation.setOptions({
        title: 'Set collaborators',
      });
    };

    load();
  }, [navigation, token]);

  const sendNewCollaborators = async () => {
    try {
      await storyService.setCollaborators(token, story.id, newCollaboratorsList);
      navigation.navigate('UserStories');
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: e,
        position: 'bottom',
      });
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
    saveButton: {
      position: 'absolute',
      bottom: 15,
      right: 15,
      width: 75,
    },
  });

  return (
    //  Main user stories
    <SafeAreaView style={styles.container}>
      <MultiSelectComponent
        items={userList}
        selectedItems={collaborators}
        select={setNewCollaboratorsList}
      />
      <Button
        style={styles.saveButton}
        size={'lg'}
        colorScheme={'secondary'}
        onPress={sendNewCollaborators}
      >
        Save
      </Button>
      <Toast />
    </SafeAreaView>
  );
}
