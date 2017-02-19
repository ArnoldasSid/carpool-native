// @flow
import type { AppState } from '../rootReducer.js';
export default (state: AppState) => ({
  inProgress: state.auth.loginInProgress,
  error: state.auth.loginError,
});
