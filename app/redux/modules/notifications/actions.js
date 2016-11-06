import {
  USER_ACCEPTED_RIDE_REQUEST,
} from './constants';

export const acceptRideRequest = (payload, requesterId) => {
  return {
    type: USER_ACCEPTED_RIDE_REQUEST,
    payload: {
      payload,
      requesterId,
    },
  };
};