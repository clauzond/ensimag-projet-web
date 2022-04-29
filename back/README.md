## Préambule
L'ensemble des commandes suivantes sont à exécuter depuis le répertoire `./back/`

# Mise en place

[Le site web](https://clauzond.herokuapp.com/)

Installer le projet:
```
npm i 
```

Mettre en place la base de données et générer la documentation :

```
npm run create-db
npm run doc
```

Installer un jeu de données (facultatif) :
```
npm run sample-db
```

Lancer le serveur :
```
npm start
```

Cette commande execute le script `start` dans le `package.json`.


Lancer le serveur avec prise en compte automatique des modifications :
```
npm start-dev
```

Cette commande execute le script `start-dev` dans le `package.json`.
