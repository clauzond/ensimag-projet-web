import { Text, TextArea, Heading, StatusBar, HStack, Checkbox, Button } from 'native-base';
import React from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';

export function StoryCreation({ navigation }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const load = async () => {
    navigation.setOptions({
      title: 'Create a story',
    });
  };

  React.useEffect(() => {
    load();
  }, []);

  // List style
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
      margin: 10,
      paddingTop: 5,
    },
    input: {
      height: 40,
      width: 300,
      borderBottomWidth: 1,
      marginBottom: 10,
      padding: 10,
    },
    multiLinesInput: {
      width: 300,
      borderBottomWidth: 1,
      marginBottom: 10,
      padding: 10,
    },
    create: {
      width: 125,
    },
  });

  const handleIndexChange = i => {
    setSelectedIndex(i);
  };

  const renderTab = i => {
    return <Text> Tab {i}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput style={styles.input} placeholder="Story title" maxLength={255} />
      <TextInput
        style={styles.multiLinesInput}
        placeholder="Content of the first paragraph"
        maxLength={255}
        multiline
        numberOfLines={5}
      />

      <SegmentedControlTab
        values={['First', 'Second', 'Third']}
        selectedIndex={selectedIndex}
        onTabPress={handleIndexChange}
      />
      {renderTab(selectedIndex)}

      <HStack space={6}>
        <Checkbox shadow={2} value="test" accessibilityLabel="This is a dummy checkbox">
          Make story public
        </Checkbox>
      </HStack>
      <Button colorScheme="primary" style={styles.create}>
        Create story
      </Button>
    </SafeAreaView>
  );
}
