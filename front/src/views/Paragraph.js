import { useAppStateContext } from '../contexts/AppState';
import { Flex, Heading, View, Text, Icon, Box, Button, ScrollView, StatusBar } from 'native-base';
import React, { useState } from 'react';
import { users } from '../services/users';
import { FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';

export function Paragraph({ navigation, route }) {
  const { token } = useAppStateContext();
  const [story, setStory] = React.useState('');

  const load = () => {
    const { item } = route.params;
    navigation.setOptions({ title: item.titre });
    setStory(item);
  };

  React.useEffect(() => {
    load();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    baseText: {
      fontFamily: 'Roboto',
      fontSize: 18,
    },
    scrollView: {
      marginHorizontal: 20,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.baseText}>
          This is where the paragraph will begin
          {'\n'}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultrices enim augue, eget
          fermentum augue ultrices non. Etiam a ipsum nisl. Donec in purus metus. Curabitur ut
          porttitor eros, a suscipit risus. Vivamus odio nulla, iaculis vitae lobortis eget, maximus
          et enim. Vivamus nisl enim, ullamcorper ac tellus sed, pretium iaculis tortor. Maecenas
          ullamcorper in est et accumsan. Pellentesque vitae felis faucibus, pretium odio et,
          imperdiet sapien. Aliquam porttitor felis sit amet tortor tincidunt elementum. Sed vitae
          odio maximus, tempus tortor id, pellentesque felis. Donec dui orci, volutpat a neque vel,
          pulvinar viverra erat. Pellentesque vitae pulvinar metus. Quisque lorem libero, mattis et
          pretium sed, vehicula nec leo. Sed facilisis id velit et convallis. Morbi dictum tortor ac
          accumsan vestibulum. Nunc eu ante et est pulvinar luctus et sed leo. Integer sodales
          convallis nunc sed sodales. In nec ipsum volutpat, pharetra est eget, condimentum tellus.
          Pellentesque nec lacinia enim, ut vulputate quam. Morbi eget luctus leo. Phasellus lacinia
          nisi elit, non imperdiet tortor mattis vel. Donec sed suscipit dui. In aliquam sem vitae
          dictum mollis. Donec sem neque, condimentum sit amet imperdiet non, sollicitudin id
          ligula. Praesent sed nibh nibh. Morbi ut urna nec lacus laoreet semper ac vitae felis.
          Integer eget metus eget mauris interdum efficitur sed ac ligula. Sed a fringilla
          arcu.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultrices enim augue, eget
          fermentum augue ultrices non. Etiam a ipsum nisl. Donec in purus metus. Curabitur ut
          porttitor eros, a suscipit risus. Vivamus odio nulla, iaculis vitae lobortis eget, maximus
          et enim. Vivamus nisl enim, ullamcorper ac tellus sed, pretium iaculis tortor. Maecenas
          ullamcorper in est et accumsan. Pellentesque vitae felis faucibus, pretium odio et,
          imperdiet sapien. Aliquam porttitor felis sit amet tortor tincidunt elementum. Sed vitae
          odio maximus, tempus tortor id, pellentesque felis. Donec dui orci, volutpat a neque vel,
          pulvinar viverra erat. Pellentesque vitae pulvinar metus. Quisque lorem libero, mattis et
          pretium sed, vehicula nec leo. Sed facilisis id velit et convallis. Morbi dictum tortor ac
          accumsan vestibulum. Nunc eu ante et est pulvinar luctus et sed leo. Integer sodales
          convallis nunc sed sodales. In nec ipsum volutpat, pharetra est eget, condimentum tellus.
          Pellentesque nec lacinia enim, ut vulputate quam. Morbi eget luctus leo. Phasellus lacinia
          nisi elit, non imperdiet tortor mattis vel. Donec sed suscipit dui. In aliquam sem vitae
          dictum mollis. Donec sem neque, condimentum sit amet imperdiet non, sollicitudin id
          ligula. Praesent sed nibh nibh. Morbi ut urna nec lacus laoreet semper ac vitae felis.
          Integer eget metus eget mauris interdum efficitur sed ac ligula. Sed a fringilla arcu.
        </Text>
      </ScrollView>
    </View>
  );
}
