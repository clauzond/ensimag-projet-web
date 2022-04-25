import { connectUser, registerUser } from './util';

const username = 'CreateStoryUser';

describe('Create story page test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display form story errors', async () => {
    await registerUser(username);
    await element(by.id('addStoryButton')).tap();

    await expect(element(by.text('Create a story'))).toBeVisible();
    await expect(element(by.text('You must specify a title'))).not.toBeVisible();
    await expect(element(by.text('The init paragraph content cannot be null'))).not.toBeVisible();

    await element(by.id('title')).tap();
    await element(by.id('paragraph')).tap();
    await expect(element(by.text('You must specify a title'))).toBeVisible();
    await expect(element(by.text('The init paragraph content cannot be null'))).toBeVisible();

    await element(by.id('submit')).tap();
    await expect(element(by.text('Create a story'))).toBeVisible();
    await expect(element(by.text('You must specify a title'))).toBeVisible();
    await expect(element(by.text('The init paragraph content cannot be null'))).toBeVisible();

    await element(by.id('title')).tap();
    await element(by.id('title')).typeText('MyTitle');
    await expect(element(by.text('You must specify a title'))).not.toBeVisible();
    await expect(element(by.text('The init paragraph content cannot be null'))).toBeVisible();

    await element(by.id('title')).clearText();
    await expect(element(by.text('You must specify a title'))).toBeVisible();
    await expect(element(by.text('The init paragraph content cannot be null'))).toBeVisible();

    await element(by.id('paragraph')).tap();
    await element(by.id('paragraph')).typeText('MyContent\nNewLine');
    await expect(element(by.text('You must specify a title'))).toBeVisible();
    await expect(element(by.text('The init paragraph content cannot be null'))).not.toBeVisible();

    await element(by.id('paragraph')).clearText();
    await expect(element(by.text('You must specify a title'))).toBeVisible();
    await expect(element(by.text('The init paragraph content cannot be null'))).toBeVisible();
  });

  it('should create a public story', async () => {
    await connectUser(username, true);
    await element(by.id('addStoryButton')).tap();

    await element(by.id('title')).typeText('MyTitle');
    await element(by.id('title')).tapReturnKey();

    await element(by.id('paragraph')).typeText('MyContent\nNewLine');
    await element(by.id('paragraph')).tapReturnKey();

    await element(by.id('pub')).tap();
    await element(by.id('submit')).tap();

    await expect(element(by.text('Customize your stories'))).toBeVisible();
  });

  it('should create a private story', async () => {
    await connectUser(username, true);
    await element(by.id('addStoryButton')).tap();

    await element(by.id('title')).typeText('MyTitle');
    await element(by.id('title')).tapReturnKey();
    await element(by.id('paragraph')).typeText('MyContent\nNewLine');
    await element(by.id('paragraph')).tapReturnKey();
    await element(by.id('submit')).tap();

    await expect(element(by.text('Customize your stories'))).toBeVisible();
  });
});
