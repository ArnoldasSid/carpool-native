import { createStore, combineReducers, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import mostAdapter from 'redux-observable-adapter-most';
import * as OneSignal from 'react-native-onesignal';

import authReducer from './modules/auth/reducer';
import authEpic from './modules/auth/epic';
import notifications from './modules/notifications/reducer';
import router from './modules/router/reducer';
import search from './modules/search/reducer';
import { ONESIGNAL_ID_AVAILABLE } from './modules/auth/constants'

export default function createAppStore () {

  const rootEpic = combineEpics(
    authEpic
  );

  const reducer = combineReducers({
    auth: authReducer,
    notifications,
    search,
    router,
  });

  const store = createStore(
    reducer,
    applyMiddleware(createEpicMiddleware(rootEpic, { adapter: mostAdapter }))
  );

  store.dispatch({
    type: 'APP_INIT',
  });

  OneSignal.enableNotificationsWhenActive(true);
  OneSignal.enableInAppAlertNotification(true);

  OneSignal.configure({
    onIdsAvailable: function(device) {
      store.dispatch({
        type: ONESIGNAL_ID_AVAILABLE,
        payload: device,
      });
    },
    onNotificationOpened: (...args) => {
      console.log('Notification opened', args);
    },
    onError: (...args) => {
      console.log('Onesignal error', args);
    },
    onNotificationsRegistered: (...args) => {
      console.log('Notification registered', args);
    }
  });

  OneSignal.getTags((receivedTags) => {
    console.log('Tags', receivedTags);
  });

  return store;
}