import { Button, Checkbox, StatusBar, Text } from 'native-base';
import React from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import { MultiSelectComponent } from '../components/multiSelect';
import { users } from '../services/users';
import { useAppStateContext } from '../contexts/AppState';

export function SetParagraph({ navigation, route }) {
  const { token } = useAppStateContext();
  const { titlePage, choices } = route.params;

  const [paragraphList, setParagraphList] = React.useState([]);
  const [newChoicesList, setNewChoicesList] = React.useState();

  React.useEffect(() => {
    const load = async () => {
      // TODO: récupérer tous les paragraphes dispo à la place des users
      const paragraphListFromApi = await users.userList(token);
      const formatParagraphList = [];
      for (const paragraph of paragraphListFromApi) {
        formatParagraphList.push({ id: paragraph.id, name: paragraph.id });
      }
      setParagraphList(formatParagraphList);

      navigation.setOptions({
        title: titlePage,
      });
    };

    load();
  }, [navigation, token, titlePage]);

  // Upload paragraph on server
  const setParagraph = async ({ title, content, isConclusion }) => {
    try {
      console.log(newChoicesList);
      // TODO : envoyer la creation/modif sur le back. La nouvelle liste de choix est dans la var newChoicesList
      // TODO : retourner sur la page de l'histoire avec la popup OK
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
      width: 150,
      marginTop: 10,
    },
    inputError: {
      color: 'red',
    },
    checkBox: {
      marginBottom: 15,
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('You must specify the title of the paragraph'),
    content: Yup.string().required('You must specify the content of the paragraph'),
  });

  return (
    <Formik
      initialValues={{
        title: '',
        content: '',
        isConclusion: false,
      }}
      validationSchema={validationSchema}
      onSubmit={setParagraph}
    >
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
        <SafeAreaView style={styles.container}>
          {/*Title input*/}
          <TextInput
            style={styles.input}
            placeholder="Paragraph title"
            maxLength={255}
            onChangeText={handleChange('title')}
            onBlur={handleBlur('title')}
            value={values.title}
          />
          {errors.title && <Text style={styles.inputError}>{errors.title}</Text>}

          {/*Paragraph content*/}
          <TextInput
            style={styles.multiLinesInput}
            placeholder="Content of the paragraph"
            maxLength={255}
            multiline
            numberOfLines={5}
            onChangeText={handleChange('content')}
            onBlur={handleBlur('content')}
            value={values.content}
          />
          {errors.content && <Text style={styles.inputError}>{errors.content}</Text>}

          {/*IsConclusion input*/}
          <Checkbox
            shadow={2}
            style={styles.checkBox}
            value={values.isConclusion}
            onChange={e => {
              handleChange('isConclusion')({ target: { value: e } });
            }}
            onBlur={handleBlur('isConclusion')}
          >
            Make this paragraph a conclusion
          </Checkbox>

          {/*Choices input*/}
          <MultiSelectComponent
            items={paragraphList}
            selectedItems={choices}
            select={setNewChoicesList}
            selectText={'Pick choices'}
            searchInputPlaceholderText={'Search paragraphs...'}
          />

          {/*Submit button*/}
          <Button colorScheme="primary" style={styles.createButton} onPress={handleSubmit}>
            {titlePage}
          </Button>
        </SafeAreaView>
      )}
    </Formik>
  );
}
