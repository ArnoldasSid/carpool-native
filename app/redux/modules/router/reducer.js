// @flow
import { ROUTE_REPLACE_REQUESTED, TAB_IND_UPDATED } from './constants';
import type { Action } from '../../../models.js';

import {
  LOGIN_SUCCEEDED,
  REGISTRATION_SUCCEEDED,
  LOGOUT_SUCCEEDED,
  AUTH_INFO_LOADED,
} from '../auth/constants';

export type RouterState = {
  route: string,
  tabInd: number,
};

const initialState: RouterState = {
  route: 'landing',
  tabInd: 0,
};

export default function routerReducer(state: RouterState = initialState, action: Action): RouterState {
  if (action.type === ROUTE_REPLACE_REQUESTED) {
    return {
      ...state,
      route: action.payload.route,
    };
  } else if (
    action.type === LOGIN_SUCCEEDED ||
    action.type === REGISTRATION_SUCCEEDED ||
    action.type === AUTH_INFO_LOADED
  ) {
    return {
      ...state,
      route: 'home',
    };
  } else if (action.type === LOGOUT_SUCCEEDED) {
    return {
      ...state,
      route: 'login',
    };
  } else if (action.type === TAB_IND_UPDATED) {
    return {
      ...state,
      tabInd: action.payload.tabInd,
    };
  }
  return state;
}
