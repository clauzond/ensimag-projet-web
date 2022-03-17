import { Sequelize, DataTypes } from "sequelize";
import path from "path";

const database = new Sequelize({
  dialect: "sqlite",
  storage: path.join(path.dirname(""), "sqlite.db"),
});
const client = database.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    prenom: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[A-Za-z\-]{2,30}$/,
      },
    },
    nom: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        is: /^[A-Za-z\-]{2,30}$/,
      },
    },
    type: {
      type: DataTypes.ENUM("Particulier", "Entreprise", "Public"),
    },
  },
  { timestamps: false }
);

await database.sync({ force: true });
