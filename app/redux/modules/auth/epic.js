import { ofType } from 'redux-observable-adapter-most';
import { just, merge } from 'most';
import { login, register, registerDevice } from '../../api';

import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  REGISTRATION_REQUESTED,
  REGISTRATION_SUCCEEDED,
  REGISTRATION_FAILED,
  ONESIGNAL_ID_REGISTERED,
  ONESIGNAL_ID_REGISTRATION_FAILED,
} from './constants';

export default function authEpic (action$, store) {
  const loginRequest$ = ofType(LOGIN_REQUESTED, action$);
  const registrationRequest$ = ofType(REGISTRATION_REQUESTED, action$);
  const loginSuccess$ = ofType(LOGIN_SUCCEEDED, action$);
  const registrationSuccess$ = ofType(REGISTRATION_SUCCEEDED, action$);

  const loginEffect$ = loginRequest$
    .chain((action) =>
      login(action.payload.email, action.payload.password)
        .map(res => ({
          type: LOGIN_SUCCEEDED,
          payload: res,
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
          payload: res,
        }))
        .recoverWith(err => just({
          type: REGISTRATION_FAILED,
          payload: err,
        }))
    );

  const oneSignalEffect$ = merge(loginSuccess$, registrationSuccess$)
    .chain((action =>
      registerDevice(store.getState().auth.oneSignalUserId)
        .map(res => ({
          type: ONESIGNAL_ID_REGISTERED,
          payload: res,
        }))
        .recoverWith(err => just({
          type: ONESIGNAL_ID_REGISTRATION_FAILED,
          payload: err,
        }))
    ));

  return merge(loginEffect$, registrationEffect$, oneSignalEffect$);
}