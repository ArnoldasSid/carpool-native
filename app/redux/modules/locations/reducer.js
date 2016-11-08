import {
  LOGOUT_SUCCEEDED,
} from '../auth/constants';
import {
  USER_LOCATION_RECEIVED,
} from './constants';

const initialState = {
};

export default function locationsReducer (state = initialState, action) {
  if (action.type === USER_LOCATION_RECEIVED) {
    return {
      ...state,
      [action.payload.userId]: action.payload.location,
    }
  } else if (action.type === LOGOUT_SUCCEEDED) {
    return initialState;
  }
  return state;
}