// @flow
import type { AppState } from '../rootReducer.js';
import R from 'ramda';
export default (state: AppState) => R.values(state.trip.otherUsers);
