// @flow

import codePush from 'react-native-code-push'
import React, { Component } from 'react'
import {
  AppRegistry,
} from 'react-native'
import { Provider } from 'react-redux'

import DumbRouter from './app/DumbRouter'
import store from './app/redux/createStore'

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
