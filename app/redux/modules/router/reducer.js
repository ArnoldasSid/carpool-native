import {
  ROUTE_REPLACE_REQUESTED,
} from './constants';

import {
  LOGIN_SUCCEEDED,
  REGISTRATION_SUCCEEDED,
  LOGOUT_SUCCEEDED,
  AUTH_INFO_LOADED,
} from '../auth/constants';

const initialState = {
  route: 'login',
};

export default function routerReducer (state = initialState, action) {
  if (action.type === ROUTE_REPLACE_REQUESTED) {
    return {
      ...state,
      route: action.payload.route,
    };
  } else if (action.type === LOGIN_SUCCEEDED || action.type === REGISTRATION_SUCCEEDED || action.type === AUTH_INFO_LOADED) {
    return {
      ...state,
      route: 'home',
    };
  } else if (action.type === LOGOUT_SUCCEEDED) {
    return {
      ...state,
      route: 'login',
    }
  }
  return state;
};