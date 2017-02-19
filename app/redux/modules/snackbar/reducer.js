// @flow
import { ADD_SNACKBAR_MESSAGE } from './constants';
import type { Action } from '../../../models.js';

export type SnackbarState = {
  activationTimestamp: number,
  text: string,
  duration: number,
};

const initialState: SnackbarState = {
  activationTimestamp: 0,
  text: '',
  duration: 0,
};

export default function snackbarReducer(state: SnackbarState = initialState, action: Action): SnackbarState {
  if (action.type === ADD_SNACKBAR_MESSAGE) {
    return {
      ...state,
      text: action.payload.text,
      duration: action.payload.duration,
    };
  }

  return state;
}
