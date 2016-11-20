import {
  LOGOUT_SUCCEEDED,
} from '../auth/constants';
import {
  USER_LOCATION_RECEIVED,
} from './constants';
import {
  TRIP_COMPLETED
} from '../currentTrip/constants.js';

const initialState = {
};

export default function locationsReducer (state = initialState, action) {
  if (action.type === USER_LOCATION_RECEIVED) {
    const currUserLocation = state[action.payload.userId];
    if (!currUserLocation || currUserLocation.timestamp < action.payload.location.timestamp) {
      return {
        ...state,
        [action.payload.userId]: action.payload.location,
      }
    }
    return state;
  } else if (action.type === LOGOUT_SUCCEEDED || action.type === TRIP_COMPLETED) {
    return initialState;
  }
  return state;
}
