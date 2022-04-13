import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar, Text } from 'native-base';

export class StoriesComponent extends React.Component {
  constructor(props) {
    super(props);

    const Item = ({ item, onPress, backgroundColor }) => (
      <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text>{item.titre}</Text>
      </TouchableOpacity>
    );

    this.renderItem = ({ item }) => {
      const backgroundColor = '#f9c2ff';
      const color = 'black';

      return (
        <Item
          item={item}
          onPress={() => this.props.onPressStory(item)}
          backgroundColor={{ backgroundColor }}
          textColor={{ color }}
        />
      );
    };
  }

  render() {
    return (
      //  Stories list
      <FlatList
        data={this.props.stories}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
      />
    );
  }
}

// List style
const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
