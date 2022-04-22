// token for "testuser" user
const TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6InRlc3R1c2VyIn0.56yrdVOXpeD7CKWq_hDlLFJH2jfOHHCmfchyKA8PaaA';
const username = 'testuser';

describe('User login signup test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  /**
   * This function connects the user on app launch
   * @returns {Promise<void>}
   */
  const connectUser = async () => {
    await expect(element(by.text(`Home - ${username}`))).toBeVisible();
    await device.pressBack();
    await element(by.text('Login')).tap();

    await element(by.id('username')).replaceText(username);
    await element(by.id('username')).tapReturnKey();

    await element(by.id('password')).replaceText('123456');
    await element(by.id('password')).tapReturnKey();

    await element(by.text('Login')).tap();
  };

  it('should signup', async () => {
    await element(by.text('Sign up')).tap();
    await element(by.id('username')).typeText('');
    await element(by.id('username')).tapReturnKey();

    await expect(element(by.text('You must specify an username'))).toBeVisible();

    await element(by.id('username')).typeText(username);
    await element(by.id('username')).tapReturnKey();

    await element(by.id('password')).typeText('');
    await element(by.id('password')).tapReturnKey();

    await expect(element(by.text('You must specify a password'))).toBeVisible();

    await element(by.id('password')).typeText('a');
    await element(by.id('password')).tapReturnKey();

    await expect(element(by.text('Password must be at least 6 characters'))).toBeVisible();

    await element(by.id('password')).replaceText('123456');
    await element(by.id('password')).tapReturnKey();
    await element(by.id('passwordVerify')).typeText('789123');
    await element(by.id('password')).tapReturnKey();

    await expect(element(by.text('Passwords must match'))).toBeVisible();

    await element(by.id('passwordVerify')).replaceText('123456');
    await element(by.id('password')).tapReturnKey();

    await element(by.text('Register')).tap();
  });

  it('should login', async () => {
    // HACK: we are already connected, go back
    await expect(element(by.text(`Home - ${username}`))).toBeVisible();
    await device.pressBack();

    await element(by.text('Login')).tap();

    await element(by.id('username')).typeText('');
    await element(by.id('username')).tapReturnKey();

    await expect(element(by.text('You must specify an username'))).toBeVisible();

    await element(by.id('username')).typeText(username);
    await element(by.id('username')).tapReturnKey();

    await element(by.id('password')).typeText('');
    await element(by.id('password')).tapReturnKey();

    await expect(element(by.text('You must specify a password'))).toBeVisible();

    await element(by.id('password')).typeText('a');
    await element(by.id('password')).tapReturnKey();

    await expect(element(by.text('Password must be at least 6 characters'))).toBeVisible();

    await element(by.id('password')).replaceText('123456');
    await element(by.id('password')).tapReturnKey();

    await element(by.text('Login')).tap();
  });

  it('should display home with a connected user', async () => {
    await expect(element(by.text(`Home - ${username}`))).toBeVisible();
    await expect(element(by.id('options'))).toBeVisible();
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
    await expect(element(by.id('addStoryButton'))).not.toBeVisible();
  });

  it('should display home popup', async () => {
    await connectUser();

    // Open popup
    await element(by.id('options')).tap();

    await expect(element(by.text('My stories'))).toBeVisible();
    await expect(element(by.text('Disconnect me'))).toBeVisible();
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
    // Login manually, since we disconnected in the previous test "should- disconnect user"
    await element(by.text('Login')).tap();

    await element(by.id('username')).replaceText(username);
    await element(by.id('username')).tapReturnKey();

    await element(by.id('password')).replaceText('123456');
    await element(by.id('password')).tapReturnKey();

    await element(by.text('Login')).tap();

    // Open user stories
    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();

    await expect(element(by.text('Customize your stories'))).toBeVisible();
  });
});
