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
  }
  return state;
}