import { Button, Checkbox, StatusBar, Text } from 'native-base';
import React from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import { MultiSelectComponent } from '../components/multiSelect';
import { users } from '../services/users';
import { useAppStateContext } from '../contexts/AppState';

export function SetParagraph({ navigation, route }) {
  const { token } = useAppStateContext();
  const { titlePage, paragraphContent, isCreation, isNewParagraph } = route.params;

  const [paragraphList, setParagraphList] = React.useState([]);
  const [parentList, setParentList] = React.useState();
  const [childList, setChildList] = React.useState();

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
      console.log(parentList);
      console.log(childList);
      // TODO : envoyer la creation/modif sur le back.
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

  return (
    <Formik
      initialValues={{
        title: '',
        content: '',
        isConclusion: false,
      }}
      onSubmit={setParagraph}
    >
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
        <SafeAreaView style={styles.container}>
          {/*Title input*/}
          {isCreation === true && (
            <TextInput
              style={styles.input}
              placeholder="Paragraph title"
              maxLength={255}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
            />
          )}
          {isCreation === true && errors.title && (
            <Text style={styles.inputError}>{errors.title}</Text>
          )}

          {/*Paragraph content*/}
          {((isCreation === true && isNewParagraph === true) || isCreation === false) && (
            <TextInput
              defaultValue={paragraphContent !== null ? paragraphContent : null}
              style={styles.multiLinesInput}
              placeholder="Content of the paragraph"
              maxLength={255}
              multiline
              numberOfLines={5}
              onChangeText={handleChange('content')}
              onBlur={handleBlur('content')}
              value={values.content}
            />
          )}
          {isCreation === true && isNewParagraph === true && errors.content && (
            <Text style={styles.inputError}>{errors.content}</Text>
          )}

          {/*IsConclusion input*/}
          {isCreation === true && isNewParagraph === true && (
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
          )}

          {/*Parent paragraph to link input*/}
          {isCreation === true && (
            <MultiSelectComponent
              items={paragraphList}
              selectedItems={[]}
              select={setParentList}
              selectText={'Pick parent paragraph'}
              searchInputPlaceholderText={'Search paragraphs...'}
              singleSelect={true}
            />
          )}

          {/*Child paragraph to link input*/}
          {isCreation === true && isNewParagraph === false && (
            <MultiSelectComponent
              items={paragraphList}
              selectedItems={[]}
              select={setChildList}
              selectText={'Pick child paragraph'}
              searchInputPlaceholderText={'Search paragraphs...'}
              singleSelect={true}
            />
          )}

          {/*Submit button*/}
          <Button colorScheme="primary" style={styles.createButton} onPress={handleSubmit}>
            {titlePage}
          </Button>
        </SafeAreaView>
      )}
    </Formik>
  );
}
