import { Sequelize, DataTypes } from "sequelize";
import path from "path";

const database = new Sequelize({
  dialect: "sqlite",
  storage: path.join(path.dirname(""), "sqlite.db"),
});

export const utilisateur = database.define(
  "Utilisateur",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    pwd: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  { timestamps: false }
);

// Sync les models a la db
await database.sync({ force: true });
