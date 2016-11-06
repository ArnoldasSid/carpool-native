import {
  USER_REQUESTED_RIDE,
  USER_ACCEPTED_RIDE_REQUEST,
} from './constants';

export const requestRide = (userEmail, userId) => {
  return {
    type: USER_REQUESTED_RIDE,
    payload: {
      userId,
      userEmail,
    },
  };
};

export const acceptRideRequest = (payload, requesterId) => {
  return {
    type: USER_ACCEPTED_RIDE_REQUEST,
    payload: {
      payload,
      requesterId,
    },
  };
};