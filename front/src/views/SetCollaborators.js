import { useAppStateContext } from '../contexts/AppState';
import { Button, StatusBar } from 'native-base';
import React from 'react';
import { storyService } from '../services/story';
import { users } from '../services/users';
import { SafeAreaView, StyleSheet } from 'react-native';

// import CustomMultiPicker from 'react-native-multiple-select-list';

export function SetCollaborators({ navigation, route }) {
  const { token, username } = useAppStateContext();
  const { story } = route.params;

  const [userList, setUserList] = React.useState({});
  const [collaboratorList, setCollaboratorList] = React.useState([]);
  const [newCollaboratorList, setNewCollaboratorList] = React.useState([]);

  const load = async () => {
    setCollaboratorList(await collaboratorsList);
    navigation.setOptions({
      title: 'Set collaborators',
    });
  };

  React.useEffect(() => {
    load();
  }, []);

  const collaboratorsList = async () => {
    const userListFromApi = await users.userList(token);
    const formatUserList = {};
    for (const user of userListFromApi) {
      formatUserList[user.id] = user.id;
    }
    setUserList(formatUserList);

    const collaboratorListFromApi = await storyService.getCollaborators(token, story.id);
    const formatCollaboratorList = [];
    for (const collaborator of collaboratorListFromApi) {
      formatCollaboratorList.push(collaborator.id);
    }
    setCollaboratorList(formatCollaboratorList);
  };

  const setCollaborators = async () => {
    // TODO: faire le tri entre les nouveaux et les anciens collaborateurs pour savoir lesquels ajouter/supprimer
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
      <CustomMultiPicker
        options={userList}
        search={true} // should show search bar?
        multiple={true} //
        placeholder={'Search users'}
        placeholderTextColor={'#757575'}
        returnValue={'value'} // label or value
        callback={res => {
          setNewCollaboratorList(res);
        }} // callback, array of selected items
        rowBackgroundColor={'#eee'}
        rowHeight={45}
        rowRadius={5}
        searchIconName="ios-checkmark"
        searchIconColor="red"
        searchIconSize={30}
        iconColor={'#00a2dd'}
        iconSize={30}
        selectedIconName={'ios-checkmark-circle-outline'}
        unselectedIconName={'ios-radio-button-off-outline'}
        scrollViewHeight={'100%'}
        selected={collaboratorList} // list of options which are selected by default
      />
      <Button
        style={styles.saveButton}
        size={'lg'}
        colorScheme={'secondary'}
        onPress={setCollaborators}
      >
        Save
      </Button>
    </SafeAreaView>
  );
}
