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
    await element(by.id('addParagraphButton')).tap();
    await createParagraph('End of story2', 'End of story2', story, { isConclusion: true });

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
    await expect(element(by.text(`Customize paragraphs`)));
    await element(by.text(story)).tap();
    await element(by.text(story)).tap();
    await element(by.text('Remove yourself from redaction')).tap();
    await expect(element(by.text('You cannot abandon the initial paragraph')));

    await element(by.text('End of story')).tap();
    await element(by.text('Remove yourself from redaction')).tap();

    await element(by.text('End of story2')).tap();
    await element(by.text('Remove yourself from redaction')).tap();

    // Start a modification as user1
    await element(by.text('End of story')).tap();
    await element(by.text('Lock and update paragraph')).tap();
    await device.pressBack();

    // Log in as user2
    await element(by.id('options')).tap();
    await element(by.text('Disconnect me')).tap();
    await connectUser(user2);

    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();
    await expect(element(by.text(story))).toBeVisible();
    await element(by.text(story)).tap();
    await element(by.text('Set paragraphs')).tap();

    await element(by.text(story)).tap();
    await expect(element(by.text(story))).toBeVisible(); // did not move into modify paragraph menu

    // User 2 can modify the non locked paragraph
    await element(by.text('End of story2')).tap();
    await element(by.text('End of story2')).tap();
    await element(by.text('Lock and update paragraph')).tap();
    await element(by.id('paragraph')).tap();
    await element(by.id('paragraph')).replaceText('end1 updated');
    await device.pressBack();
    await element(by.id('submit')).tap();

    // Log back as user1, unlock the paragraph and remove from redaction
    await device.pressBack();
    await element(by.id('options')).tap();
    await element(by.text('Disconnect me')).tap();
    await connectUser(user1);

    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();
    await expect(element(by.text(story))).toBeVisible();
    await element(by.text(story)).tap();
    await element(by.text('Set paragraphs')).tap();

    await element(by.text('End of story')).tap();
    await element(by.text('End of story')).tap();
    await element(by.text('Update paragraph')).tap();
    await element(by.id('paragraph')).tap();
    await element(by.id('paragraph')).replaceText('End of story updated (user1)');
    await device.pressBack();
    await element(by.id('submit')).tap();

    await element(by.text('End of story')).tap();
    await element(by.text('Remove yourself from redaction')).tap();

    // user2 can modify the previously locked paragraph
    await device.pressBack();
    await element(by.id('options')).tap();
    await element(by.text('Disconnect me')).tap();
    await connectUser(user2);

    await element(by.id('options')).tap();
    await element(by.text('My stories')).tap();
    await expect(element(by.text(story))).toBeVisible();
    await element(by.text(story)).tap();
    await element(by.text('Set paragraphs')).tap();

    await element(by.text('End of story')).tap();
    await element(by.text('End of story')).tap();
    await element(by.text('Lock and update paragraph')).tap();
    await element(by.id('paragraph')).tap();
    await element(by.id('paragraph')).replaceText('End of story updated (user2)');
    await device.pressBack();
    await element(by.id('submit')).tap();
  });
});
