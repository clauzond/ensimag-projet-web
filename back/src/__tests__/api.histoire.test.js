import { app } from '../app.js';
import request from 'supertest';
import { Utilisateur, Paragraphe, Histoire } from '../models/index.js';

describe('Test fonctions histoire', () => {
    test("Test unitaire histoire", async() => {
        const u1 = await Utilisateur.create({
            id: 'clauzond',
            pwd: 'clauzonmdp'
        });
        const p1 = await Paragraphe.create({ contenu: 'woooow' });
        const p2 = await Paragraphe.create({ contenu: 'hooo' });
        const p3 = await Paragraphe.create({ contenu: 'hooo' });
        const p4 = await Paragraphe.create({ contenu: 'hooo' });
        const p5 = await Paragraphe.create({ contenu: 'hooo' });

        const h1 = await Histoire.create({
            titre: 'Histoire de clauzond (ya des dingueries)',
            idAuteur: u1.get('id'),
            idParaInit: p1.get('id')
        });

        await h1.setParagrapheInitial(p1);
        await p1.addChoix(p2, { through: { titreChoix: 'hey', condititon: null } });

        let u = await u1.setHistorique(h1, [p5.id, p3.id]);
        let h = await u.getHistoriqueArrayParagraphe(h1);
        expect(h.length).toBe(2);
        expect(h[0].id).toBe(p5.id);
        expect(h[1].id).toBe(p3.id);

        await u1.addHistorique(h1, p2);
        h = await u.getHistoriqueArrayParagraphe(h1);
        expect(h.length).toBe(3);
        expect(h[0].id).toBe(p5.id);
        expect(h[1].id).toBe(p3.id);
        expect(h[2].id).toBe(p2.id);

        await u1.removeHistorique(h1, p3);
        h = await u.getHistoriqueArrayParagraphe(h1);
        expect(h.length).toBe(2);
        expect(h[0].id).toBe(p5.id);
        expect(h[1].id).toBe(p2.id);

        await u1.clearHistorique(h1);
        h = await u.getHistoriqueArrayParagraphe(h1);
        expect(h.length).toBe(0);

        await u1.addHistorique(h1, p4);
        h = await u.getHistoriqueArrayParagraphe(h1);
        expect(h.length).toBe(1);
        expect(h[0].id).toBe(p4.id);

        await u1.addHistorique(h1, p1);
        h = await u.getHistoriqueArrayParagraphe(h1);
        expect(h.length).toBe(2);
        expect(h[0].id).toBe(p4.id);
        expect(h[1].id).toBe(p1.id);

    });
});