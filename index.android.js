// @flow

import codePush from 'react-native-code-push'
import React, { Component } from 'react'
import {
  AppRegistry,
} from 'react-native'
import { Provider } from 'react-redux'
import OneSignal from 'react-native-onesignal'

import DumbRouter from './app/DumbRouter'
import store from './app/redux/createStore'
import { ONESIGNAL_ID_AVAILABLE } from './app/redux/modules/auth/constants'

OneSignal.enableNotificationsWhenActive(false)
OneSignal.enableInAppAlertNotification(false)

OneSignal.configure({
  onIdsAvailable: (device) => {
    store.dispatch({
      type: ONESIGNAL_ID_AVAILABLE,
      payload: device,
    })
  },
  onNotificationOpened: (message, data, isActive) => {
    console.log('Notification opened', message, data, isActive)
    alert('Notification received: ' + message)
    // TODO: Dispatch on notification opened action here
  },
})

export default class CarpoolNative extends Component {
  render () {
    return (
      <Provider store={store}>
        <DumbRouter />
      </Provider>
    )
  }
}

CarpoolNative = codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME })(CarpoolNative)

AppRegistry.registerComponent('CarpoolNative', () => CarpoolNative)
