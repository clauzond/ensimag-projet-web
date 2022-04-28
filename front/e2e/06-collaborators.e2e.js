import { connectUser, createStory, registerUser, createParagraph } from './util';

const user1 = 'Collaborator1';
const user2 = 'Collaborator2';
const story = 'sharedStory';

describe('Collaborator test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should allow collaboration on a story', async () => {
    await registerUser(user2);
    await element(by.id('options')).tap();
    await element(by.text('Disconnect me')).tap();

    await registerUser(user1);
    // Logged in as user1

    // Add one conclusion paragraph
    await createStory(story, 'content1', true);

    await expect(element(by.text('Customize your stories'))).toBeVisible();
    await expect(element(by.text(story))).toBeVisible();

    await element(by.text(story)).tap();
    await element(by.text('Set paragraphs')).tap();

    await createParagraph('End of story', 'End of story', story, { isConclusion: true });

    // Invite user2 as collaborator
    await device.pressBack();
    await expect(element(by.text(`Home - ${user1}`))).toBeVisible();
    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();
    await element(by.text(story)).tap();
    await element(by.text('Set collaborators')).tap();
    await element(by.text('Pick collaborators (1 selected)')).tap();
    await element(by.text(user2)).tap();
    await element(by.text('Save')).tap();

    await device.pressBack();
    await expect(element(by.text(`Home - ${user1}`))).toBeVisible();
    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();
    await element(by.text(story)).tap();
    await element(by.text('Set paragraphs')).tap();

    // Free all paragraphs for modification
    await element(by.text(story)).tap();
    await element(by.text('Remove yourself from redaction')).tap();
    await element(by.text('End of story')).tap();
    await element(by.text('Remove yourself from redaction')).tap();

    // Lock the end of story paragraph again: start a modification and go back
    await element(by.text('End of story')).tap();
    await device.pressBack();

    // Log back in as user2
    await expect(element(by.text(`Home - ${user1}`))).toBeVisible();
    await element(by.id('options')).tap();
    await element(by.text('Disconnect me')).tap();
    await connectUser(user2);

    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();
    await expect(element(by.text(story))).toBeVisible();
    await element(by.text(story)).tap();
    await element(by.text('Set paragraphs')).tap();

    // End of story para locked -> not allowed to modify
    await element(by.text('End of story')).tap();
    await element(by.text('Update paragraph')).tap();
    await expect(element(by.text('End of story'))).toBeVisible(); // did not move into modify paragraph menu

    // Can modify the other paragraph
    await element(by.text(story)).tap();
    await element(by.text('Lock and update paragraph')).tap();
    await element(by.id('paragraph')).tap();
    await element(by.id('paragraph')).replaceText('content1 updated');
    await device.pressBack();
    await element(by.text('Modify paragraph')).tap();

    // Log back as user1 and finish the modification
    await element(by.id('options')).tap();
    await element(by.text('Disconnect me')).tap();
    await connectUser(user1);

    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();
    await expect(element(by.text(story))).toBeVisible();
    await element(by.text(story)).tap();
    await element(by.text('Set paragraphs')).tap();

    await element(by.text('End of story')).tap();
    await element(by.text('Update paragraph')).tap();
    await element(by.id('paragraph')).tap();
    await element(by.id('paragraph')).replaceText('End of story updated (user1)');
    await device.pressBack();
    await element(by.text('Modify paragraph')).tap();

    // user2 can modify the end of story paragraph now
    await element(by.id('options')).tap();
    await element(by.text('Disconnect me')).tap();
    await connectUser(user2);

    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();
    await expect(element(by.text(story))).toBeVisible();
    await element(by.text(story)).tap();
    await element(by.text('Set paragraphs')).tap();

    await element(by.text('End of story')).tap();
    await element(by.text('Update paragraph')).tap();
    await element(by.id('paragraph')).tap();
    await element(by.id('paragraph')).replaceText('End of story updated (user2)');
    await device.pressBack();
    await element(by.text('Modify paragraph')).tap();
  });
});
