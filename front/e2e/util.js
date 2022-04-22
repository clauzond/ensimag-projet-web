/**
 * This function connects the user on app launch
 * @param goBackBeforeLogin True if you are on home page
 * @returns {Promise<void>}
 */
async function connectUser(username, goBackBeforeLogin) {
  if (goBackBeforeLogin) {
    await expect(element(by.text(`Home - ${username}`))).toBeVisible();
    await device.pressBack();
  }
  await element(by.text('Login')).tap();

  await element(by.id('username')).replaceText(username);
  await element(by.id('username')).tapReturnKey();

  await element(by.id('password')).replaceText('123456');
  await element(by.id('password')).tapReturnKey();

  await element(by.text('Login')).tap();
}

async function registerUser(username) {
  await element(by.text('Sign up')).tap();

  await element(by.id('username')).replaceText(username);
  await element(by.id('username')).tapReturnKey();

  await element(by.id('password')).replaceText('123456');
  await element(by.id('password')).tapReturnKey();
  await element(by.id('passwordVerify')).replaceText('123456');
  await element(by.id('password')).tapReturnKey();

  await element(by.text('Register')).tap();
}

export { connectUser, registerUser };
