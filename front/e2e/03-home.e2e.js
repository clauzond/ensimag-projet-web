import { connectUser, registerUser } from './util';

const username = 'HomeUser';

describe('Home page test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display home with a connected user', async () => {
    await registerUser(username);
    await expect(element(by.text(`Home - ${username}`))).toBeVisible();
    await expect(element(by.id('options'))).toBeVisible();
    await expect(element(by.id('refresh'))).toBeVisible();
    await expect(element(by.id('addStoryButton'))).toBeVisible();
  });

  it('should display home with a guest user', async () => {
    // Launch app as guest
    await expect(element(by.text(`Home - ${username}`))).toBeVisible();
    await device.pressBack();
    await element(by.text('Continue as guest')).tap();

    await expect(element(by.text('Home'))).toBeVisible();
    await expect(element(by.text(`Home - ${username}`))).not.toBeVisible();
    await expect(element(by.id('options'))).not.toBeVisible();
    await expect(element(by.id('refresh'))).not.toBeVisible();
    await expect(element(by.id('addStoryButton'))).not.toBeVisible();
  });

  it('should display home popup', async () => {
    await connectUser(username, true);

    // Open popup
    await element(by.id('options')).tap();

    await expect(element(by.text('My stories'))).toBeVisible();
    await expect(element(by.text('Disconnect me'))).toBeVisible();
  });

  it('should display reload popup', async () => {
    // Tap on refresh button
    await element(by.id('refresh')).tap();

    await expect(element(by.text('Story list reloaded'))).toBeVisible();
    await expect(element(by.text(`Home - ${username}`))).toBeVisible();
    await expect(element(by.id('addStoryButton'))).toBeVisible();
  });

  it('should disconnect user', async () => {
    // Disconnect user
    await element(by.id('options')).tap();
    await element(by.text('Disconnect me')).tap();

    await expect(element(by.text('Sign up'))).toBeVisible();
    await expect(element(by.text('Login'))).toBeVisible();
    await expect(element(by.text('Continue as guest'))).toBeVisible();
  });

  it('should display user stories', async () => {
    // Login manually, since we disconnected in the previous test "should disconnect user"
    await connectUser(username, false);

    // Open user stories
    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();

    await expect(element(by.text('Customize your stories'))).toBeVisible();
  });
});
