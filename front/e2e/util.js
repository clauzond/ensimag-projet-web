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
  await expect(element(by.text(`Home - ${username}`))).toBeVisible();
}

// Note : this function works only from home page
async function createStory(title, paragraphContent, isPublic) {
  await element(by.id('addStoryButton')).tap();

  await element(by.id('title')).typeText(title);
  await element(by.id('paragraph')).typeText(paragraphContent);
  isPublic !== undefined && isPublic === true ? await element(by.id('pub')).tap() : null;
  await element(by.id('submit')).tap();
}

export { connectUser, registerUser, createStory };
