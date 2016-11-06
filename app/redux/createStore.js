import { createStore, combineReducers, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import mostAdapter from 'redux-observable-adapter-most';
import * as OneSignal from 'react-native-onesignal';
import { composeWithDevTools } from 'remote-redux-devtools';

import auth from './modules/auth/reducer';
import authEpic from './modules/auth/epic';
import notifications from './modules/notifications/reducer';
import notificationsEpic from './modules/notifications/epic';
import currentTrip from './modules/currentTrip/reducer';
import currentTripEpic from './modules/currentTrip/epic';
import locations from './modules/locations/reducer';
import locationsEpic from './modules/locations/epic';
import router from './modules/router/reducer';
import { ONESIGNAL_ID_AVAILABLE } from './modules/auth/constants'

export default function createAppStore () {

  const rootEpic = combineEpics(
    authEpic,
    notificationsEpic,
    currentTripEpic,
    locationsEpic,
  );

  const reducer = combineReducers({
    auth,
    notifications,
    currentTrip,
    router,
    locations,
  });

  const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(createEpicMiddleware(rootEpic, { adapter: mostAdapter }))),
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

  return store;
}