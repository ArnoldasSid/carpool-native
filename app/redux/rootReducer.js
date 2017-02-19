// @flow
import { combineReducers } from 'redux';

import auth from './modules/auth/reducer';
import type { AuthState } from './modules/auth/reducer.js';
import notifications from './modules/notifications/reducer';
import type { NotificationsState } from './modules/notifications/reducer.js';
import router from './modules/router/reducer';
import type { RouterState } from './modules/router/reducer.js';
import trip from './modules/trip/reducer';
import type { TripState } from './modules/trip/reducer.js';
import snackbar from './modules/snackbar/reducer';
import type { SnackbarState } from './modules/snackbar/reducer.js';
import devLog from './modules/devLog/reducer.js';
import type { DevLogState } from './modules/devLog/reducer.js';

export type AppState = {
  auth: AuthState,
  notifications: NotificationsState,
  router: RouterState,
  trip: TripState,
  snackbar: SnackbarState,
  devLog: DevLogState,
};

export default combineReducers({
  auth,
  notifications,
  router,
  trip,
  snackbar,
  devLog,
});
