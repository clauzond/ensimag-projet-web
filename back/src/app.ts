import express from "express";
import { Sequelize, Model, DataTypes } from "sequelize";
import path from "path";

const PORT = 8080;
const app = express();

app.use((req, res) => {
  res.send("Salut clauzon d");
});

app.listen(PORT, () => {
  console.log(`Backend up at http://localhost:${PORT}`);
});
