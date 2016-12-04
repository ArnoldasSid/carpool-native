import {
  USER_REQUESTED_RIDE,
  USER_WITHDRAWN_RIDE_REQUEST,
  USER_ACCEPTED_RIDE_REQUEST,
  TRIP_COMPLETED,
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
export const withdrawRideRequest = () => {
  return {
    type: USER_WITHDRAWN_RIDE_REQUEST,
  }
};
export const acceptRideRequest = (payload, requesterId, notificationId) => {
  return {
    type: USER_ACCEPTED_RIDE_REQUEST,
    payload: {
      payload,
      requesterId,
      notificationId,
    },
  };
};
export const tripCompleted = () => {
  return {
    type: TRIP_COMPLETED,
  };
};