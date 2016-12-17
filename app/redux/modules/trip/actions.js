import {
  USER_REQUESTED_RIDE,
  USER_WITHDRAWN_RIDE_REQUEST,
  USER_ACCEPTED_RIDE_REQUEST,
  TRIP_COMPLETED,
  TRIP_LOADED,
  YOUR_LOCATION_UPDATED,
} from './constants'

export const requestRide = (userEmail, userId) => {
  return {
    type: USER_REQUESTED_RIDE,
    payload: {
      userId,
      userEmail,
    },
  }
}

export const withdrawRideRequest = () => {
  return {
    type: USER_WITHDRAWN_RIDE_REQUEST,
  }
}

export const acceptRideRequest = (payload, requesterId, notificationId) => {
  return {
    type: USER_ACCEPTED_RIDE_REQUEST,
    payload: {
      payload,
      requesterId,
      notificationId,
    },
  }
}

export const loadTrip = (tripState) => {
  return {
    type: TRIP_LOADED,
    payload: tripState,
  }
}

export const completeTrip = () => {
  return {
    type: TRIP_COMPLETED,
  }
}

export const updateYourLocation = (location) => {
  return {
    type: YOUR_LOCATION_UPDATED,
    payload: {
      location,
    },
  }
}
