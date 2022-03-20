import express from "express";
import { utilisateur, histoire, paragraphe, historique } from "./model";

const PORT = 8080;
const app = express();

const clauzond = await utilisateur.create({ id: "clauzondid", pwd: "clauzonmdp" });
const paragrapheclauzond = await paragraphe.create({ contenu: 'woooow' });
const histoireClauzond = await histoire.create({
  idAuteur: clauzond.get("id"),
  idParaInit: paragrapheclauzond.get("id")
});
const histoClauzond = await historique.create({
  idUtil: clauzond.get("id"),
  idHist: histoireClauzond.get("id"),
  idPara: [paragrapheclauzond.get("id")]
})

app.use((req, res) => {
  res.send("Salut clauzond, ton id c'est" + clauzond.get("id") + " et ton historique c'est" + histoClauzond.get("idPara"));
});

app.listen(PORT, () => {
  console.log(`Backend up at http://localhost:${PORT}`);
});
