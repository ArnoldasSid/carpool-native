// @flow
import type { AppState } from '../rootReducer.js';
export default (state: AppState) => ({
  inProgress: state.auth.registrationInProgress,
  error: state.auth.registrationError,
});
