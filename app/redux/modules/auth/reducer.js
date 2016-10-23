import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
} from './constants';

const initialState = {
  loggedIn: false,
  loginInProgress: false,
  loginError: null,
  authToken: null,
  userEmail: null,
  userId: null,
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
      userEmail: action.payload.email,
    };
  } else if (action.type === LOGIN_FAILED) {
    console.log(action.payload);
    return {
      ...state,
      loginInProgress: false,
      loggedIn: false,
      loginError: action.payload.reason,
    }
  }
  return state;
}
