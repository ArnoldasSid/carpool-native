import {
  ADD_SNACKBAR_MESSAGE,
} from './constants'

const initialState = {
  activationTimestamp: 0,
  text: '',
  duration: 0,
}

export default function snackbarReducer (state = initialState, action) {
  if (action.type === ADD_SNACKBAR_MESSAGE) {
    return {
      ...state,
      text: action.payload.text,
      duration: action.payload.duration,
    }
  }

  return state
};
