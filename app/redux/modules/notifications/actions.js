import {
  USER_ACCEPTED_RIDE_REQUEST,
  MARK_NOTIFICATION_AS_READ_REQUESTED,
} from './constants'

export const acceptRideRequest = (payload, requesterId) => {
  return {
    type: USER_ACCEPTED_RIDE_REQUEST,
    payload: {
      payload,
      requesterId,
    },
  }
}

export const markNotificationAsRead = (notificationId) => {
  return {
    type: MARK_NOTIFICATION_AS_READ_REQUESTED,
    payload: {
      notificationId,
    },
  }
}
