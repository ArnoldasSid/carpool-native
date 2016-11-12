/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Provider } from 'react-redux';
import OneSignal from 'react-native-onesignal';

import DumbRouter from './app/DumbRouter';
import createStore from './app/redux/createStore';
import { ONESIGNAL_ID_AVAILABLE } from './app/redux/modules/auth/constants'

const store = createStore();

OneSignal.enableNotificationsWhenActive(false);
OneSignal.enableInAppAlertNotification(false);

OneSignal.configure({
  onIdsAvailable: function(device) {
    store.dispatch({
      type: ONESIGNAL_ID_AVAILABLE,
      payload: device,
    });
  },
  onNotificationOpened: function(message, data, isActive) {
    console.log('Notification opened', message, data, isActive);
    alert('Notification received: ' + message);
    // TODO: Dispatch on notification opened action here
  }
});

export default class CarpoolNative extends Component {
  render() {
    return (
      <Provider store={store}>
        <DumbRouter />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('CarpoolNative', () => CarpoolNative);
