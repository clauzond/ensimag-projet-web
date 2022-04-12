import { Flex, Heading, View, Text, Icon, Box, Button, ScrollView, StatusBar } from 'native-base';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { storyService } from '../services/story';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 18,
  },
});

export class ParagraphComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Box p="2" w="90%" py="8" colorScheme="secondary">
        <Text style={styles.baseText}>
            {this.props.paragraph.contenu}
        </Text>
        {this.props.choiceRowArray.map((value, index) => {
          return (
            <Button key={value.ChoixId}>{value.titreChoix}</Button>
          );
        })
        }
      </Box>
    );
  }
}
