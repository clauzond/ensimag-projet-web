import { Button, Checkbox, StatusBar, Text } from 'native-base';
import React from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { Formik } from 'formik';
import { useAppStateContext } from '../contexts/AppState';
import { storyService } from '../services/story';
import * as Yup from 'yup';
import { paragraphService } from '../services/paragraph';
import Toast from 'react-native-toast-message';

export function CreateStory({ navigation }) {
  const { token } = useAppStateContext();

  const load = async () => {
    navigation.setOptions({
      title: 'Create a story',
    });
  };
  React.useEffect(() => {
    load();
  }, []);

  // Upload story on server
  const setStory = async ({ title, opened, pub, paragraph }) => {
    try {
      const newStory = await storyService.createStory(token, title, opened, pub);
      await paragraphService.updateParagraph(
        token,
        newStory.id,
        newStory.idParagrapheInitial,
        paragraph
      );
      navigation.navigate('UserStories', {
        storyCreated: true,
      });
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
      marginBottom: 15,
      padding: 10,
    },
    createButton: {
      position: 'absolute',
      bottom: 15,
      right: 15,
      width: 125,
      marginTop: 10,
    },
    inputError: {
      color: 'red',
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('You must specify a title'),
  });

  return (
    <Formik
      initialValues={{
        title: '',
        opened: false,
        pub: false,
        paragraph: '',
      }}
      validationSchema={validationSchema}
      onSubmit={setStory}
    >
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
        <SafeAreaView style={styles.container}>
          {/*Title input*/}
          <TextInput
            style={styles.input}
            placeholder="Story title"
            maxLength={255}
            onChangeText={handleChange('title')}
            onBlur={handleBlur('title')}
            value={values.title}
          />
          {errors.title && <Text style={styles.inputError}>{errors.title}</Text>}

          {/*First paragraph input*/}
          <TextInput
            style={styles.multiLinesInput}
            placeholder="Content of the first paragraph"
            maxLength={255}
            multiline
            numberOfLines={5}
            onChangeText={handleChange('paragraph')}
            onBlur={handleBlur('paragraph')}
            value={values.paragraph}
          />
          {errors.paragraph && <Text style={styles.inputError}>{errors.paragraph}</Text>}

          {/*IsPublic input*/}
          <Checkbox
            shadow={2}
            value={values.pub}
            onChange={e => {
              handleChange('pub')({ target: { value: e } });
            }}
            onBlur={handleBlur('pub')}
            accessibilityLabel="This is a dummy checkbox"
          >
            Make story public
          </Checkbox>
          <Text style={{ fontStyle: 'italic' }}>
            When it ended, the story can be read by anyone
          </Text>

          {/*Submit button*/}
          <Button colorScheme="primary" style={styles.createButton} onPress={handleSubmit}>
            Create story : {values.title}
          </Button>
          <Toast />
        </SafeAreaView>
      )}
    </Formik>
  );
}
