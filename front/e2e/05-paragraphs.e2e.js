import { connectUser, createStory, registerUser, createParagraph } from './util';

const username = 'ParagraphsUser';
const titleSimpleStory = 'firstStory';

describe('User stories page test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display & read simple story', async () => {
    await registerUser(username);
    await createStory(titleSimpleStory, 'myContent', true);

    await expect(element(by.text('Customize your stories'))).toBeVisible();
    await expect(element(by.text(titleSimpleStory))).toBeVisible();

    await element(by.text(titleSimpleStory)).tap();
    await element(by.text('Set paragraphs')).tap();

    await createParagraph('Go to end', 'End of story', titleSimpleStory, { isConclusion: true });

    // Read the story
    await device.pressBack();
    await device.pressBack();
    await element(by.id('refresh')).tap();
    await element(by.text(titleSimpleStory)).tap();

    await expect(element(by.text('myContent\nGo to end\nEnd of story'))).toBeVisible();
  });

  // TODO: move into function & add more complicated stories
  // do: publish a story, with some paragraphs with no conclusion => do not display
  // do: conditional paragraph, and reading test based on history (do not display if condition not set)
});
