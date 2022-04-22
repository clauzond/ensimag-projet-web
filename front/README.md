# Installation

Mettre en place le react native: [suivre le tp react native](https://chamilo.grenoble-inp.fr/courses/ENSIMAG4MMCAWE6/document/tp/projet.html) jusqu'a "Premiere Page". 

**Attention** quand il vous dit d'aller sur cette page: https://reactnative.dev/docs/environment-setup, ne prenez **pas** les instructions pour le "Expo CLI Quickstart", suivez celles pour le "React Native CLI Quickstart".

Lancez le backend, nécéssaire en mode développement:
```
cd back
npm start
```

Pour lancer le frontend, dans un premier terminal:

```
npx react-native start
```

et dans un deuxième terminal:

```
npx react-native run-android
```

# Lancer les tests

```
cd back && npm run create-db && npm start # lancer le back
npm run build-test # compile l'appli test
npm start # lance react native
npm run test # installe l'appli et lance le test detox
```

Entre chaque lancement des tests, il faudra vider la base de données.

Si ca marche pas, vérifiez que vous avec l'émulateur du `pixel3A` ca s'installe de android studio. 
Il faudra le renommer dans avd manager en "pixel3A".

Pour relancer un test rapidement (sans ré-installer l'appli)

```
npm run test-reuse
```

# Générer l'APK

[Guide React-Native](https://reactnative.dev/docs/signed-apk-android)

Générer l'APK:
```shell
npm run build-android
```

L'apk généré se trouve dans `android/app/build/outputs/apk/release/app-release.apk`, installable sur téléphone

Lancer l'APK release sur l'émulateur:
```
npx react-native run-android --variant=release
```

Si ca marche pas, désinstallez l'application dans l'émulateur. 

# Documentation

Les composants: [NativeBase](https://docs.nativebase.io/?utm_source=HomePage&utm_medium=header&utm_campaign=NativeBase_3)

Navigation entre les pages: [React-Navigation](https://reactnavigation.org/docs/getting-started)

a
