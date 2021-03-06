// @flow
import { ofType } from 'redux-observable-adapter-most';
import { AsyncStorage } from 'react-native';
import { just, merge, fromPromise, never } from 'most';
import { login, logout, register, registerDevice, unsubAll } from '../../api';

import { APP_INIT, DDP_CONNECTED } from '../app/constants.js';
import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  REGISTRATION_REQUESTED,
  REGISTRATION_SUCCEEDED,
  REGISTRATION_FAILED,
  ONESIGNAL_ID_REGISTERED,
  ONESIGNAL_ID_REGISTRATION_FAILED,
  ONESIGNAL_ID_AVAILABLE,
  LOGOUT_REQUESTED,
  LOGOUT_SUCCEEDED,
} from './constants';

import { ROUTE_REPLACE_REQUESTED } from '../router/constants.js';

export default function authEpic(action$: any) {
  const loginRequest$ = ofType(LOGIN_REQUESTED, action$);
  const registrationRequest$ = ofType(REGISTRATION_REQUESTED, action$);
  const loginSuccess$ = ofType(LOGIN_SUCCEEDED, action$);
  const registrationSuccess$ = ofType(REGISTRATION_SUCCEEDED, action$);
  const appInit$ = ofType(APP_INIT, action$);
  const ddpReconnect$ = ofType(DDP_CONNECTED, action$).skip(1);
  const logoutRequest$ = ofType(LOGOUT_REQUESTED, action$);

  const loadAuthToken$ = merge(appInit$, ddpReconnect$).chain(() => fromPromise(
    AsyncStorage.getItem('authInfo'),
  ).chain(res => {
    if (res == null) {
      return just({
        type: ROUTE_REPLACE_REQUESTED,
        payload: {
          route: 'login',
        },
      });
    }
    const parsedRes = JSON.parse(res);
    return login(parsedRes.email, parsedRes.password)
      .map(res => ({
        type: LOGIN_SUCCEEDED,
        payload: {
          ...res,
          email: parsedRes.email,
          password: parsedRes.password,
        },
      }))
      .recoverWith(err => just({
        type: ROUTE_REPLACE_REQUESTED,
        payload: {
          route: 'login',
        },
      }));
  }));

  const loginEffect$ = loginRequest$.chain(action => login(action.payload.email, action.payload.password)
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
    })));

  const registrationEffect$ = registrationRequest$.chain(action => register(
    action.payload.email,
    action.payload.password,
  )
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
    })));

  const oneSignalEffect$ = merge(loginSuccess$, registrationSuccess$)
    .combine(
      (authInfo, oneSignalInfo) => oneSignalInfo.payload.userId,
      ofType(ONESIGNAL_ID_AVAILABLE, action$),
    )
    .chain(oneSignalUserId => registerDevice(oneSignalUserId)
      .map(res => ({
        type: ONESIGNAL_ID_REGISTERED,
        payload: res,
      }))
      .recoverWith(err => just({
        type: ONESIGNAL_ID_REGISTRATION_FAILED,
        payload: err,
      })));

  const saveAuthToken$ = merge(loginSuccess$, registrationSuccess$).chain(action => {
    AsyncStorage.setItem('authInfo', JSON.stringify(action.payload));
    return never();
  });

  const logout$ = logoutRequest$.chain(() => logout().map(res => {
    AsyncStorage.removeItem('authInfo');
    unsubAll();
    return {
      type: LOGOUT_SUCCEEDED,
    };
  }));

  return merge(loginEffect$, registrationEffect$, oneSignalEffect$, saveAuthToken$, loadAuthToken$, logout$);
}
