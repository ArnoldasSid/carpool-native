import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  REGISTRATION_REQUESTED,
  REGISTRATION_SUCCEEDED,
  REGISTRATION_FAILED,
  ONESIGNAL_ID_AVAILABLE,
  ONESIGNAL_ID_REGISTERED,
  ONESIGNAL_ID_REGISTRATION_FAILED,
} from './constants';

const initialState = {
  loggedIn: false,
  loginInProgress: false,
  loginError: null,
  registrationInProgress: false,
  registrationError: null,
  authToken: null,
  userId: null,
  oneSignalUserId: null,
  oneSignalPushToken: null,
  oneSignalIdRegistered: false,
};

export default function authReducer (state = initialState, action) {
  if (action.type === LOGIN_REQUESTED) {
    return {
      ...state,
      loginInProgress: true,
    };
  } else if (action.type === LOGIN_SUCCEEDED) {
    return {
      ...state,
      loginInProgress: false,
      loggedIn: true,
      loginError: null,
      authToken: action.payload.token,
      userId: action.payload.id,
    };
  } else if (action.type === LOGIN_FAILED) {
    return {
      ...state,
      loginInProgress: false,
      loggedIn: false,
      loginError: action.payload.reason,
    }
  } else if (action.type === REGISTRATION_REQUESTED) {
    return {
      ...state,
      registrationInProgress: true,
    };
  } else if (action.type === REGISTRATION_SUCCEEDED) {
    return {
      ...state,
      registrationInProgress: false,
      registrationError: null,
      loggedIn: true,
      authToken: action.payload.token,
      userId: action.payload.id,
    };
  } else if (action.type === REGISTRATION_FAILED) {
    return {
      ...state,
      registrationInProgress: false,
      registrationError: action.payload.reason,
      loggedIn: false,
    };
  } else if (action.type === ONESIGNAL_ID_AVAILABLE) {
    return {
      ...state,
      oneSignalUserId: action.payload.userId,
      oneSignalPushToken: action.payload.pushToken,
    };
  } else if (action.type === ONESIGNAL_ID_REGISTERED) {
    return {
      ...state,
      oneSignalIdRegistered: true,
    }
  } else if (action.type === ONESIGNAL_ID_REGISTRATION_FAILED) {
    alert('Could not register device');
    return state;
  }
  return state;
}
