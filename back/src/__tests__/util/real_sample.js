import { createParagraph, createStory, getToken, updateParagraph } from "./setupDb";


async function generateSample() {
    const username = "root";
    const password = "azerty";

    const story = await createStory("Coincé en D208", username, true, "[sonnerie qui retentit au loin, vous vous réveillez en D208] 'Tiens, c'est bizarre... J'ai du m'assoupir sur mon diagramme de séquence, il fait déjà nuit, il faut que je trouve un moyen de sortir de la salle.'", undefined, password);
    
    const choix1 = await createParagraph(story, "Se diriger vers la porte d'entrée", username, story.idParagrapheInitial, null, false, undefined, password);
    await updateParagraph(story, choix1.id, "Vous vous approchez de la porte d'entrée. La porte semble fermée à clef.", username, password);
    const choix2 = await createParagraph(story, "Continuer à dormir", username, story.idParagrapheInitial, null, false, undefined, password);
    await updateParagraph(story, choix2.id, "'ZZzzzz...'\n[Un jour plus tard...]\n", username, password);
    const choix3 = await createParagraph(story, "Regarder par la fenêtre", username, story.idParagrapheInitial, null, false, undefined, password);
    await updateParagraph(story, choix3.id, "Il fait presque nuit...", username, password);

    const choix1_1 = await createParagraph(story, "Fouiller la salle pour trouver la clef", username, choix1.id, null, false, undefined, password);
    await updateParagraph(story, choix1_1.id, "Vous parcourez la salle de fond en comble, toutes les tables sont vides sauf celle sur laquelle vous vous êtes endormis. Vous trouvez la clef sous votre cahier ! 'Je ne me rappelle même pas être rentré dans cette salle... En plus on est Vendredi et je ne suis même pas dans ce batiment aujourd'hui... Au moins j'ai trouvé la clef de la porte.'", username, password);
    const choix1_2 = await createParagraph(story, "Tenter d'ouvrir la porte", username, choix1.id, null, false, undefined, password);
    await updateParagraph(story, choix1_2.id, "La porte est fermée à clef.", username, password);
    const choix1_3 = await createParagraph(story, "Retourner voir vos affaires", username, choix1.id, null, false, undefined, password);
    await updateParagraph(story, choix1_3.id, "Vous retournez à votre table, rien de nouveau.", username, password);
    const choix1_4 = await createParagraph(story, "Ouvrir la porte avec votre clef", username, choix1.id, null, false, choix1_1.id, password);
    await updateParagraph(story, choix1_4.id, "Vous entrez la clef dans la serrure, et tournez la clef.", username, password);
    const choix1_4_1 = await createParagraph(story, "Ouvrir la porte", username, choix1_4.id, null, true, undefined, password);
    await updateParagraph(story, choix1_4_1.id, "Bravo, vous avez réussi à sortir !", username, password);

    const choix2_1 = await createParagraph(story, "-", username, choix2.id, story.idParagrapheInitial, false, undefined, password);

    const choix3_1 = await createParagraph(story, "Observer votre reflet", username, choix3.id, null, false, undefined, password);
    await updateParagraph(story, choix3_1.id, "Il fait presque nuit...", username, password);
    const choix3_2 = await createParagraph(story, "Retourner dormir", username, choix3.id, choix2_1.id, false, undefined, password);

    const choix1_1_1 = await createParagraph(story, "Retourner observer la porte", username, choix1_1.id, choix1.id, false, undefined, password);

    const choix1_2_1 = await createParagraph(story, "-", username, choix1_2.id, story.idParagrapheInitial, false, undefined, password);


    const choix1_3_1 = await createParagraph(story, "Se diriger vers la porte d'entrée", username, choix1_3.id, choix1.id, false, undefined, password);
    const choix1_3_2 = await createParagraph(story, "Continuer à dormir", username, choix1_3.id, choix2.id, false, undefined, password);
    const choix1_3_3 = await createParagraph(story, "Regarder par la fenêtre", username, choix1_3.id, choix3.id, false, undefined, password);
}

async function generateSample2() {
    const username = "root2";
    const password = "azerty";

    const story = await createStory("Transformer", username, true, "Aurélien is a student at Ensimag.  He also writes about the history of religion, spirituality and democracy.  He was originally a student at McGill University in Montreal.  He has been a member of the Montreal Catholic Students Association since 1991. But he has one secret : he has been on the internet.", undefined, password);
    
    const choix1 = await createParagraph(story, "Approach Aurélien", username, story.idParagrapheInitial, null, false, undefined, password);
    await updateParagraph(story, choix1.id, "'Alright, let's go get some water.'  I said, getting up.  After running for a while,  I arrived at an alley.  I entered the alley, and I was approached by the man in the blue coat.", username, password);
    const choix2 = await createParagraph(story, "Go for a walk", username, story.idParagrapheInitial, null, false, undefined, password);
    await updateParagraph(story, choix2.id, "You're only going to be back around 9pm or so. I'd recommend walking around, but if you want to go back and get a better sense of the city's history , you might have to try exploring the nearby museum.", username, password);
    const choix2_1 = await createParagraph(story, "Explore the museum", username, choix2.id, null, false, undefined, password);
    await updateParagraph(story, choix2_1.id, "You head for the museum.  When you see the red brick wall at the museum that is surrounded by the black metal walls, you are probably here to see one of the three statues. They each hold  a key to unlock a secret door that leads to the back room of the museum.", username, password);
    const choix1_2 = await createParagraph(story, "Ask him about the city", username, choix1.id, null, false, undefined, password);
    await updateParagraph(story, choix1_2.id, "You approach the man in the blue coat and ask him about the city.  He looks at you for a few seconds,  then shakes his head :  'There isn't anything there...'   The police have been watching you closely all this time...  They're still waiting for you to tell them what you saw.", username, password);
    const choix1_3 = await createParagraph(story, "Ask him about the statues", username, choix1.id, null, false, choix2_1.id, password);
    await updateParagraph(story, choix1_3.id, "You ask Aurélien about the hidden keys in the statues. He says that some were built by his ancestors to protect them from enemies and thieves. Behind the back door rests clauzond.", username, password);
   
    const choix3 = await createParagraph(story, "Explore the museum", username, story.idParagrapheInitial, choix2_1.id, false, choix1_2.id, password);
    const choix4 = await createParagraph(story, "Go back to sleep, knowing the museum is safe", username, story.idParagrapheInitial, null, true, choix1_3.id, password);
    await updateParagraph(story, choix4.id, "As Aurélien told me, the museum is safe thanks to the three statues hiding the keys. I hope nobody else will get this information.", username, password);

    const choix1_1 = await createParagraph(story, "Ask him about his name", username, choix1.id, null, false, undefined, password);
    await updateParagraph(story, choix1_1.id, "You approach the man in the blue coat and ask for his name.  'Aurélien' he says. You ask for his address. He gives you a 'Good morning , Sir' and hands you a piece of paper. You read it and read the date. It is Saturday, September 20, 1984. You take the paper and put it in your pocket.", username, password);
    
    const choix1_1_1 = await createParagraph(story, "Explore the museum", username, choix1_1.id, choix2_1.id, false, undefined, password);
    const choix1_1_2 = await createParagraph(story, "Go back to the beginning", username, choix1_1.id, story.idParagrapheInitial, false, undefined, password);
    const choix1_2_1 = await createParagraph(story, "Explore the museum", username, choix1_2.id, choix2_1.id, false, undefined, password);
    const choix1_2_2 = await createParagraph(story, "Go back to the beginning", username, choix1_2.id, story.idParagrapheInitial, false, undefined, password);

    const choix2_2 = await createParagraph(story, "Wait for 9pm", username, choix2.id, choix1.id, false, undefined, password);
    
    const choix1_3_1 = await createParagraph(story, "Go back to the beginning", username, choix1_3.id, story.idParagrapheInitial, false, undefined, password);
    const choix2_1_1 = await createParagraph(story, "Go back to the beginning", username, choix2_1.id, story.idParagrapheInitial, false, undefined, password);
}

await generateSample();
await generateSample2();
console.log("Done");