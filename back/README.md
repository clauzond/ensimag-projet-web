# Setup

Installer le projet:
```
npm i 
```

Lancer le server:
```
npm start
```

Cette commande execute le script `start` dans le `package.json`.

# Base de données

Bdd dans le fichier`sqlite.db`.

Pour modifier la bdd, on fait une migration: voir https://sequelize.org/master/manual/migrations.html

Créer une nouvelle migration :
```
npx sequelize-cli migration:create --name create-user
```

Modifier le fichier nouvellement créé dans `migrations/`. On peut mettre des définition en objet et ca fait le SQL pour nous.

Pour faire: le TP https://viardots.pages.ensimag.fr/cawsv/7-Express/, et le site officiel: https://sequelize.org/master/manual/model-basics.html#model-definition

Pour faire une migration:
```
npx sequelize-cli db:migrate
```

Undo la derniere migration:
```
npx sequelize-cli db:migrate:undo
```
