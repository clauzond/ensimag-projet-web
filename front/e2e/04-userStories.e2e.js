import { connectUser, createStory, registerUser } from './util';

const username = 'UserStoriesUser';
const titlePublicStory = 'First public story';
const titlePrivateStory = 'First private story';

describe('User stories page test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display story created', async () => {
    await registerUser(username);
    await createStory(titlePublicStory, 'myContent', true);
    await device.pressBack();
    await createStory(titlePrivateStory, 'myContent', false);

    await expect(element(by.text('Customize your stories'))).toBeVisible();
    await expect(element(by.text(titlePublicStory))).toBeVisible();
    await expect(element(by.text(titlePrivateStory))).toBeVisible();
  });

  it('should display popup of story options', async () => {
    // Go on user stories page
    await connectUser(username, true);
    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();

    await element(by.text(titlePublicStory)).tap();
    await expect(element(by.text('Make story private'))).toBeVisible();
    await expect(element(by.text('Allow modifications'))).toBeVisible();
    await expect(element(by.text('Set collaborators'))).toBeVisible();
    await expect(element(by.text('Set paragraphs'))).toBeVisible();

    // Allow modifications
    await element(by.text('Allow modifications')).tap();
    await expect(element(by.text('Modification saved'))).toBeVisible();

    // Make story private
    await element(by.text(titlePublicStory)).tap();
    await element(by.text('Make story private')).tap();
    await expect(element(by.text('Modification saved'))).toBeVisible();
    await element(by.text(titlePublicStory)).tap();
    await expect(element(by.text('Make story public'))).toBeVisible();

    // Make story public
    await device.pressBack();
    await element(by.text(titlePrivateStory)).tap();
    await element(by.text('Make story public')).tap();
    await expect(element(by.text('Modification saved'))).toBeVisible();
    await element(by.text(titlePrivateStory)).tap();
    await expect(element(by.text('Make story private'))).toBeVisible();
  });
});
