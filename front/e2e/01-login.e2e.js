const username = 'LoginUser';

describe('User login signup test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

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
    await device.pressBack();

    await element(by.text('Register')).tap();
    await expect(element(by.text(`Home - ${username}`))).toBeVisible();
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
    await expect(element(by.text(`Home - ${username}`))).toBeVisible();
  });
});
