import express from "express";
import { utilisateur } from "./model";

const PORT = 8080;
const app = express();

const clauzond = await utilisateur.create({ pwd: "clauzonmdp" });

app.use((req, res) => {
  res.send("Salut clauzon d, ton mdp c'est" + clauzond.get("pwd"));
});

app.listen(PORT, () => {
  console.log(`Backend up at http://localhost:${PORT}`);
});
