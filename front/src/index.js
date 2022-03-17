/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import packageInfo from './app.json';

AppRegistry.registerComponent(packageInfo.name, () => App);
AppRegistry.runApplication(packageInfo.name, {
  rootTag: document.getElementById('root'),
});
