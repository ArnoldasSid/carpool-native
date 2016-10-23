import { createStore, combineReducers, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import mostAdapter from 'redux-observable-adapter-most';


import authReducer from './modules/auth/reducer';
import authEpic from './modules/auth/epic';
import notifications from './modules/notifications/reducer';
import search from './modules/search/reducer';

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

  return store;
}
