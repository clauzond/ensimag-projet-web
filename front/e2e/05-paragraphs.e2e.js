import { connectUser, createParagraph, createStory, registerUser } from './util';

const username = 'ParagraphsUser';
const titleSimpleStory = 'firstStory';
const titleSecondStory = 'secondStory';

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

  it('should not show a story, as long as a story branch is not finished', async () => {
    await connectUser(username, true);

    await createStory(titleSecondStory, 'content1', true);

    await element(by.text(titleSecondStory)).tap();
    await element(by.text('Set paragraphs')).tap();

    await createParagraph('title2', 'content2', titleSecondStory);

    await expect(element(by.text('title2'))).toBeVisible();
    await createParagraph('title3', 'content3', titleSecondStory, { isConclusion: true });

    await device.pressBack();
    await device.pressBack();
    await element(by.id('refresh')).tap();
    await element(by.text(titleSecondStory)).tap();

    // Paragraph title2 in unfinished story branch -> not display
    await expect(
      element(
        by.text(`content1
title3
content3`)
      )
    ).toBeVisible();
  });

  // TODO: add choice into existing story:
  // * test case pick parent pargraph
  // * test case pick parent & child paragraph
  // TODO: conditional paragraph, and reading test based on history (do not display if condition not set)
});
