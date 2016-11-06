import { ofType } from 'redux-observable-adapter-most';
import { AsyncStorage } from 'react-native';
import { just, merge, fromPromise, never } from 'most';
import { login, logout, register, registerDevice, unsubAll } from '../../api';

import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  REGISTRATION_REQUESTED,
  REGISTRATION_SUCCEEDED,
  REGISTRATION_FAILED,
  ONESIGNAL_ID_REGISTERED,
  ONESIGNAL_ID_REGISTRATION_FAILED,
  AUTH_INFO_LOADED,
  LOGOUT_REQUESTED,
  LOGOUT_SUCCEEDED,
} from './constants';

export default function authEpic (action$, store) {
  const loginRequest$ = ofType(LOGIN_REQUESTED, action$);
  const registrationRequest$ = ofType(REGISTRATION_REQUESTED, action$);
  const loginSuccess$ = ofType(LOGIN_SUCCEEDED, action$);
  const registrationSuccess$ = ofType(REGISTRATION_SUCCEEDED, action$);
  const appInit$ = ofType('APP_INIT', action$);
  const logoutRequest$ = ofType(LOGOUT_REQUESTED, action$);

  const loginEffect$ = loginRequest$
    .chain((action) =>
      login(action.payload.email, action.payload.password)
        .map(res => ({
          type: LOGIN_SUCCEEDED,
          payload: {
            ...res,
            email: action.payload.email,
            password: action.payload.password,
          },
        }))
        .recoverWith(err => just({
          type: LOGIN_FAILED,
          payload: err,
        }))
    );

  const registrationEffect$ = registrationRequest$
    .chain((action) =>
      register(action.payload.email, action.payload.password)
        .map(res => ({
          type: REGISTRATION_SUCCEEDED,
          payload: {
            ...res,
            email: action.payload.email,
            password: action.payload.password,
          },
        }))
        .recoverWith(err => just({
          type: REGISTRATION_FAILED,
          payload: err,
        }))
    );

  const oneSignalEffect$ = merge(loginSuccess$, registrationSuccess$)
    .chain(action =>
      registerDevice(store.getState().auth.oneSignalUserId)
        .map(res => ({
          type: ONESIGNAL_ID_REGISTERED,
          payload: res,
        }))
        .recoverWith(err => just({
          type: ONESIGNAL_ID_REGISTRATION_FAILED,
          payload: err,
        }))
    );

  const saveAuthToken$ = merge(loginSuccess$, registrationSuccess$)
    .chain(action => {
      AsyncStorage.setItem('authInfo', JSON.stringify(action.payload));
      return never();
    });

  const loadAuthToken$ = appInit$
    .chain(() =>
      fromPromise(AsyncStorage.getItem('authInfo'))
        .map(res => {
          if (res == null) {
            return { type: '' };
          }
          const parsedRes = JSON.parse(res);
          return {
            type: LOGIN_REQUESTED,
            payload: {
              email: parsedRes.email,
              password: parsedRes.password,
            },
          };
        })
    );

  const logout$ = logoutRequest$
    .chain(() =>
      logout()
        .map(res => {
          AsyncStorage.removeItem('authInfo');
          unsubAll();
          return {
            type: LOGOUT_SUCCEEDED,
          }
        })
    );

  return merge(loginEffect$, registrationEffect$, oneSignalEffect$, saveAuthToken$, loadAuthToken$, logout$);
}