import { connectUser, createChoice, createParagraph, createStory, registerUser } from './util';

const username = 'ParagraphsUser';
const titleSimpleStory = 'firstStory';
const titleNewStory = 'newStory';
const titleNewestStory = 'newestStory';

describe('Create stories tests', () => {
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

  it('should add a choice', async () => {
    await connectUser(username, true);

    await createStory(titleNewStory, 'content4', true);

    await element(by.text(titleNewStory)).tap();
    await element(by.text('Set paragraphs')).tap();

    await createParagraph('title4', 'content4', titleNewStory);
    await element(by.id('addParagraphButton')).tap();
    await createParagraph('title5', 'content5', titleNewStory, { isConclusion: true });
    await element(by.id('addParagraphButton')).tap();
    await createChoice('title6', 'title4', 'title5');

    await device.pressBack();
    await device.pressBack();
    await element(by.id('refresh')).tap();
    await element(by.text(titleNewStory)).tap();

    await expect(element(by.text('content4'))).toBeVisible();
    await expect(element(by.text('title4'))).toBeVisible();
    await expect(element(by.text('title5'))).toBeVisible();
  });

  it('should not be displayed if condition is not met', async () => {
    await connectUser(username, true);

    await createStory(titleNewestStory, 'content7', true);

    await element(by.text(titleNewestStory)).tap();
    await element(by.text('Set paragraphs')).tap();

    await createParagraph('title8', 'content8', titleNewestStory);
    await element(by.id('addParagraphButton')).tap();
    await createParagraph('title9', 'content9', titleNewestStory, { condition: 'title8' }); // Should not be displayed because paragraph 8 is not visible
    await element(by.id('addParagraphButton')).tap();
    await createParagraph('title10', 'content10', 'title8', { isConclusion: true });

    await device.pressBack();
    await device.pressBack();
    await element(by.id('refresh')).tap();
    await element(by.text(titleNewestStory)).tap();

    await device.pressBack();
    await device.pressBack();
    await element(by.id('refresh')).tap();
    await element(by.text(titleNewestStory)).tap();

    await expect(element(by.text('content7\ntitle8\ncontent8\ntitle10\ncontent10'))).toBeVisible();
  });
});
