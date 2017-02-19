// @flow
import { MARK_NOTIFICATION_AS_READ_REQUESTED } from './constants';
import { USER_ACCEPTED_RIDE_REQUEST } from '../trip/constants.js';

export const acceptRideRequest = (payload: any, requesterId: string) => {
  return {
    type: USER_ACCEPTED_RIDE_REQUEST,
    payload: {
      payload,
      requesterId,
    },
  };
};

export const markNotificationAsRead = (notificationId: string) => {
  return {
    type: MARK_NOTIFICATION_AS_READ_REQUESTED,
    payload: {
      notificationId,
    },
  };
};
