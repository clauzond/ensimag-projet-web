import { Text, Box, Button, StatusBar } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

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
        <Text style={styles.baseText}>{this.props.paragraph.contenu}</Text>
        {this.props.choiceRowArray.map(value => {
          return (
            <Button key={value.ChoixId} onPress={() => this.props.onPressChoice(value.ChoixId)}>
              {value.titreChoix}
            </Button>
          );
        })}
      </Box>
    );
  }
}
