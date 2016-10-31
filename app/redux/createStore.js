import { createStore, combineReducers, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import mostAdapter from 'redux-observable-adapter-most';
import OneSignal from 'react-native-onesignal';


import authReducer from './modules/auth/reducer';
import authEpic from './modules/auth/epic';
import notifications from './modules/notifications/reducer';
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
  });

  const store = createStore(
    reducer,
    applyMiddleware(createEpicMiddleware(rootEpic, { adapter: mostAdapter }))
  );

  OneSignal.configure({
    onIdsAvailable: function(device) {
      store.dispatch({
        type: ONESIGNAL_ID_AVAILABLE,
        payload: device,
      });
    }
  });

  return store;
}
