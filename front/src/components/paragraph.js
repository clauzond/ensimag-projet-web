import { Text, Box, Button, StatusBar } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 18,
  },
  hidden: {
    display: 'none',
  },
  choice: {
    marginTop: 15,
  },
});

export class ParagraphComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Box p="2" w="90%" py="8" colorScheme="secondary">
        <Text style={styles.baseText}>{this.props.paragraph.contenu}</Text>
        {this.props.choiceRowArray.map(value => {
          return (
            <Button
              style={styles.choice}
              key={value.ChoixId}
              onPress={() => this.props.onPressChoice(value.ChoixId, value.titreChoix)}
            >
              {value.titreChoix}
            </Button>
          );
        })}
        <Picker
          selectedValue={this.props.history[this.props.history.length - 1].paragraph.id}
          onValueChange={(itemValue, itemIndex) => {
            this.props.onPressHistory(itemIndex);
          }}
        >
          {this.props.history.map(value => {
            return (
              <Picker.Item
                label={value.title}
                value={value.paragraph.id}
                key={value.paragraph.id}
              />
            );
          })}
        </Picker>
      </Box>
    );
  }
}
