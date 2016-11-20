import {
  LOGOUT_SUCCEEDED,
} from '../auth/constants.js';

import {
  USER_ACCEPTED_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
  USER_REQUESTED_RIDE,
  TRIP_COMPLETED,
} from './constants.js';

const initialState = {
  status: '', // Driver/Rider/RequestingRide/''
  driver: {},
  riders: [],
};

export default function currentTripReducer (state = initialState, action) {
  if (action.type === USER_REQUESTED_RIDE) {
    return {
      ...state,
      status: 'requestingRide',
    }
  } else if (action.type === USERS_RIDE_REQUEST_GOT_ACCEPTED) {
    return {
      ...state,
      status: 'rider',
      driver: action.payload,
    }
  } else if (action.type === USER_ACCEPTED_RIDE_REQUEST) {
    console.log('USER ACCEPTED RIDE REQUEST', action);
    return {
      ...state,
      status: 'driver',
      riders: [...state.riders, action.payload]
    }
  } else if (action.type === LOGOUT_SUCCEEDED, action.type === TRIP_COMPLETED) {
    return initialState;
  }

  return state;
}
