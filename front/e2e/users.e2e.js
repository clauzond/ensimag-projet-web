// token for "testuser" user
const TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6InRlc3R1c2VyIn0.56yrdVOXpeD7CKWq_hDlLFJH2jfOHHCmfchyKA8PaaA';

describe('User login signup test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should try to signup & login', async () => {
    await element(by.text('Sign up')).tap();
    await element(by.id('username')).typeText('');
    await element(by.id('username')).tapReturnKey();

    await expect(element(by.text('You must specify an username'))).toBeVisible();

    await element(by.id('username')).typeText('testuser');
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

    // Register done, go back and login
    await device.pressBack();
    await element(by.text('Back')).tap();
    await element(by.text('Login')).tap();

    // Login test
    await element(by.id('username')).typeText('testuser');
    await element(by.id('username')).tapReturnKey();
    await element(by.id('password')).typeText('123456');
    await element(by.id('password')).tapReturnKey();
    await element(by.text('Login')).tap();

    // Go back
    await device.pressBack();
    await element(by.text('Back')).tap();

    // Continue as guest (should have no user)
    await element(by.text('Continue as guest')).tap();
  });
});
