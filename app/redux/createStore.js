import { createStore, combineReducers, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import mostAdapter from 'redux-observable-adapter-most';
import { composeWithDevTools } from 'remote-redux-devtools';

import auth from './modules/auth/reducer';
import authEpic from './modules/auth/epic';
import notifications from './modules/notifications/reducer';
import notificationsEpic from './modules/notifications/epic';
// import currentTrip from './modules/currentTrip/reducer';
// import currentTripEpic from './modules/currentTrip/epic';
// import locations from './modules/locations/reducer';
// import locationsEpic from './modules/locations/epic';
import router from './modules/router/reducer';
import trip from './modules/trip/reducer';
import tripSaga from './modules/trip/saga';
import snackbar from './modules/snackbar/reducer';
import createSagaMiddleware from 'redux-saga';

export default function createAppStore () {

  const rootEpic = combineEpics(
    authEpic,
    notificationsEpic,
    // currentTripEpic,
    // locationsEpic,
  );

  const sagaMiddleware = createSagaMiddleware();

  const reducer = combineReducers({
    auth,
    notifications,
    // currentTrip,
    router,
    // locations,
    trip,
    snackbar,
  });

  const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware, createEpicMiddleware(rootEpic, { adapter: mostAdapter }))),
  );

  sagaMiddleware.run(tripSaga);

  store.dispatch({
    type: 'APP_INIT',
  });

  return store;
}