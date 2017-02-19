// @flow
import type { AppState } from '../rootReducer.js';
export default (state: AppState) => ({
  loggedIn: state.auth.loggedIn,
  authToken: state.auth.authToken,
  userEmail: state.auth.userEmail,
  userId: state.auth.userId,
});
