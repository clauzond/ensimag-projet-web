## Préambule
L'ensemble des commandes suivantes sont à exécuter depuis le répertoire `./front/`

# Installation

Mettre en place le react native : [suivre le tp react native](https://chamilo.grenoble-inp.fr/courses/ENSIMAG4MMCAWE6/document/tp/projet.html) jusqu'a "Premiere Page". 

**Attention** quand il vous dit d'aller sur cette page: https://reactnative.dev/docs/environment-setup, ne prenez **pas** les instructions pour le "Expo CLI Quickstart", suivez celles pour le "React Native CLI Quickstart".

Lancez le backend, nécessaire en mode développement :
```
cd back
npm start
```

Pour lancer le frontend, dans un premier terminal :

```
npm i
npx react-native start
```

Puis, dans un second terminal :

```
npx react-native run-android
```

# Lancer les tests

```
cd back && npm run doc && npm run create-db && npm start # lancer le back
npm run build-test # compile l'appli test
npm start # lance react native
npm run test # installe l'appli et lance le test detox
```

Entre chaque lancement des tests, il faudra vider la base de données (`npm run create-db`)

Si ça ne marche pas, vérifiez que vous utilisez l'émulateur `pixel3A` (installable depuis Android Studio). 
Il faudra le renommer dans AVD Manager en "pixel3A".

Pour relancer un test rapidement (sans ré-installer l'appli) :

```
npm run test-reuse
```

# Documentation

Les composants : [NativeBase](https://docs.nativebase.io/?utm_source=HomePage&utm_medium=header&utm_campaign=NativeBase_3)

Navigation entre les pages : [React-Navigation](https://reactnavigation.org/docs/getting-started)
