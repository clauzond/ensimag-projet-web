import { createParagraph, createStory, getToken, updateParagraph } from "./setupDb";



async function generateSample() {
    const username = "clap";
    const story = await createStory("Coincé en D208", username, true, "[sonnerie qui retentit au loin, vous vous réveillez en D208] 'Tiens, c'est bizarre... J'ai du m'assoupir sur mon diagramme de séquence, il fait déjà nuit, il faut que je trouve un moyen de sortir de la salle.'");
    
    const choix1 = await createParagraph(story, "Se diriger vers la porte d'entrée", username, story.idParagrapheInitial, null, false);
    await updateParagraph(story, choix1.id, "Vous vous approchez de la porte d'entrée. La porte semble fermée à clef.", username);
    const choix2 = await createParagraph(story, "Continuer à dormir", username, story.idParagrapheInitial, null, false);
    await updateParagraph(story, choix2.id, "'ZZzzzz...'\n[Un jour plus tard...]\n", username);
    const choix3 = await createParagraph(story, "Regarder par la fenêtre", username, story.idParagrapheInitial, null, false);
    await updateParagraph(story, choix3.id, "Il fait presque nuit...", username);

    const choix1_1 = await createParagraph(story, "Fouiller la salle pour trouver la clef", username, choix1.id, null, false);
    await updateParagraph(story, choix1_1.id, "Vous parcourez la salle de fond en comble, toutes les tables sont vides sauf celle sur laquelle vous vous êtes endormis. Vous trouvez la clef sous votre cahier ! 'Je ne me rappelle même pas être rentré dans cette salle... En plus on est Vendredi et je ne suis même pas dans ce batiment aujourd'hui... Au moins j'ai trouvé la clef de la porte.'", username);
    const choix1_2 = await createParagraph(story, "Tenter d'ouvrir la porte", username, choix1.id, null, false);
    await updateParagraph(story, choix1_2.id, "La porte est fermée à clef.", username);
    const choix1_3 = await createParagraph(story, "Retourner voir vos affaires", username, choix1.id, null, false);
    await updateParagraph(story, choix1_3.id, "Vous retournez à votre table, rien de nouveau.", username);
    const choix1_4 = await createParagraph(story, "Ouvrir la porte avec votre clef", username, choix1.id, null, false, choix1_1.id);
    await updateParagraph(story, choix1_4.id, "Vous entrez la clef dans la serrure, et tournez la clef.", username);
    const choix1_4_1 = await createParagraph(story, "Ouvrir la porte", username, choix1_4.id, null, true);
    await updateParagraph(story, choix1_4_1.id, "Bravo, vous avez réussi à sortir !", username);

    const choix2_1 = await createParagraph(story, "-", username, choix2.id, story.idParagrapheInitial, false);

    const choix3_1 = await createParagraph(story, "Observer votre reflet", username, choix3.id, null, false);
    await updateParagraph(story, choix3_1.id, "Il fait presque nuit...", username);
    const choix3_2 = await createParagraph(story, "Retourner dormir", username, choix3.id, choix2_1.id, false);

    const choix1_1_1 = await createParagraph(story, "Retourner observer la porte", username, choix1_1.id, choix1.id, false);

    const choix1_2_1 = await createParagraph(story, "-", username, choix1_2.id, story.idParagrapheInitial, false);


    const choix1_3_1 = await createParagraph(story, "Se diriger vers la porte d'entrée", username, choix1_3.id, choix1.id, false);
    const choix1_3_2 = await createParagraph(story, "Continuer à dormir", username, choix1_3.id, choix2.id, false);
    const choix1_3_3 = await createParagraph(story, "Regarder par la fenêtre", username, choix1_3.id, choix3.id, false);
}

await generateSample();
console.log("Done");