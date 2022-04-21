import { Button, Checkbox, StatusBar, Text } from 'native-base';
import React from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import { MultiSelectComponent } from '../components/multiSelect';
import { storyService } from '../services/story';
import { useAppStateContext } from '../contexts/AppState';
import { paragraphService } from '../services/paragraph';

export function SetParagraph({ navigation, route }) {
  const { token } = useAppStateContext();
  const { story, titlePage, paragraphContent, isCreation, isNewParagraph } = route.params;

  const [paragraphList, setParagraphList] = React.useState([]);
  const [paragraphListWithoutConclusion, setParagraphListWithoutConclusion] = React.useState([]);
  const [parentList, setParentList] = React.useState([]);
  const [childList, setChildList] = React.useState([]);
  const [conditionList, setConditionList] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      const paragraphsFromApi = await storyService.getParagraphList(token, story.id);
      const formatParagraphList = [];
      const formatParagraphListWithoutConclusion = [];
      for (const paragraph of paragraphsFromApi) {
        formatParagraphList.push({ id: paragraph.id, name: paragraph.titre });
        if (paragraph.estConclusion === false) {
          formatParagraphListWithoutConclusion.push({ id: paragraph.id, name: paragraph.titre });
        }
      }
      setParagraphList(formatParagraphList);
      setParagraphListWithoutConclusion(formatParagraphListWithoutConclusion);

      navigation.setOptions({
        title: titlePage,
      });
    };

    load();
  }, [navigation, token, titlePage, story.id]);

  // Upload paragraph on server
  const setParagraph = async ({ title, content, isConclusion }) => {
    try {
      let { paragraphSelected } = route.params;
      if (isCreation) {
        const parContent = content.length !== 0 ? content : undefined;
        const idParent = parentList.length !== 0 ? parentList[0] : undefined;
        const idChild = childList.length !== 0 ? childList[0] : undefined;
        const condition = conditionList.length !== 0 ? conditionList[0] : undefined;
        if (title.length === 0 && isCreation) {
          Toast.show({
            type: 'error',
            text1: 'You must specify a title',
            position: 'bottom',
          });
          return;
        }
        if (idParent === undefined) {
          Toast.show({
            type: 'error',
            text1: 'You must choose a parent paragraph',
            position: 'bottom',
          });
          return;
        }
        paragraphSelected = await paragraphService.createParagraph(
          token,
          story.id,
          title,
          parContent,
          idParent,
          idChild,
          isConclusion,
          condition
        );
      } else {
        await paragraphService.updateParagraph(token, story.id, paragraphSelected.id, content);
      }

      navigation.navigate('SetParagraphs', {
        story: story,
        lastParagraphId: paragraphSelected.id,
      });
      Toast.show({
        text1: `${isNewParagraph ? 'Paragraph' : 'Choice'} ${isCreation ? 'added' : 'updated'}!`,
        position: 'bottom',
      });
    } catch (e) {
      console.error(e);
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
      color: '#000',
    },
    multiLinesInput: {
      width: 300,
      borderBottomWidth: 1,
      marginBottom: 15,
      padding: 10,
      color: '#000',
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
        content: paragraphContent,
        isConclusion: true,
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
              placeholderTextColor={'rgb(100,96,96)'}
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
              placeholder="Content of the paragraph (leave empty to allow other collaborators to participate)"
              placeholderTextColor={'rgb(100,96,96)'}
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
              items={paragraphListWithoutConclusion}
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

          {/*Condition*/}
          {isCreation === true && (
            <MultiSelectComponent
              items={paragraphList}
              selectedItems={[]}
              select={setConditionList}
              selectText={'Pick a condition'}
              searchInputPlaceholderText={'Search paragraphs...'}
              singleSelect={true}
            />
          )}

          {/*Submit button*/}
          <Button colorScheme="primary" style={styles.createButton} onPress={handleSubmit}>
            {titlePage}
          </Button>
          <Toast />
        </SafeAreaView>
      )}
    </Formik>
  );
}
