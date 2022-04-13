import { useAppStateContext } from '../contexts/AppState';
import { Text, TextArea, Heading, StatusBar, IconButton, HStack, Checkbox} from 'native-base';
import React from 'react';
import { users } from '../services/users';
import { storyService } from '../services/story';
import { paragraphService } from '../services/paragraph';
import { FlatList, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Popup from 'react-native-easypopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SegmentedControlTab from "react-native-segmented-control-tab";

export function Creation({ navigation }) {
  const { token, setHistory } = useAppStateContext();
  const [stories, setStories] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(null);

  const [state, setState] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const load = async () => {
    if (token !== '') {
      // Authentified user case
      const storiesFromApi = await storyService.getPublicAuthentifiedStories(token);
      setStories(storiesFromApi);
    } else {
      // Guest user case
      const storiesFromApi = await storyService.getPublicStories();
      setStories(storiesFromApi);
    }
  };


  const header = async () => {
    if (token !== '') {
      const username = await users.whoami(token);
      // Set header buttons
      navigation.setOptions({
        title: `Story creation - ${username}`,
        headerRight: () => (
          <TouchableOpacity>
            <IconButton
              size={'lg'}
              _icon={{
                as: MaterialIcons,
                name: 'more-vert',
              }}
              onPress={() => setState(true)}
            />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity>
            <IconButton
              size={'lg'}
              _icon={{
                as: MaterialIcons,
                name: 'menu',
              }}
              onPress={() => {
                //TODO: display lateral menu
              }}
            />
          </TouchableOpacity>
        ),
      });
    }
  };

  React.useEffect(() => {
    load().then(_ => header());
  }, []);

  // List style
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    add_button: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
    },
  });

  const handleIndexChange = (i)=>{setSelectedIndex(i)};

  const renderTab = (i)=>{return <Text> Tab {i}</Text>}

  return (
    // view
    <SafeAreaView style={styles.container}>
      <Heading>I'm a Heading</Heading>
      <TextArea shadow={2} h={20} placeholder="First paragraph" w="200" _light={{
        placeholderTextColor: "trueGray.700"
      }} _dark={{
        bg: "coolGray.800"
      }} _hover={{
        bg: "coolGray.200"
      }} />

<SegmentedControlTab
          values={["First", "Second", "Third"]}
          selectedIndex={selectedIndex}
          onTabPress={handleIndexChange}
        />
      {renderTab(selectedIndex)}

      <HStack space={6}>
      <Checkbox shadow={2} value="test" accessibilityLabel="This is a dummy checkbox">
        Make story public
      </Checkbox>
      </HStack>

      {/*Disconnect popup*/}
      <Popup
        showpopup={state}
        type="alert"
        semitransparent={false}
        animation={'fade'}
        onPress={() => setState({ showpopup: !state })}
        contenttext={'Do you want to disconnect ?'}
        acceptbuttontitle={'OK'}
        cancelbuttontitle={'Cancel'}
        confirmaction={() => {
          setHistory(null);
          AsyncStorage.setItem('@token', token).then(_ => navigation.navigate('Welcome'));
        }}
        cancelaction={() => {
          setState(false);
        }}
      />
    </SafeAreaView>
  );
}
