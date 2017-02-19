// @flow
import type { UsersRole, Location } from '../../../models.js';
import {
  USER_REQUESTED_RIDE,
  USER_WITHDRAWN_RIDE_REQUEST,
  USER_ACCEPTED_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
  USER_RECEIVED_RIDE_REQUEST,
  TRIP_COMPLETED,
  TRIP_LOADED,
  YOUR_LOCATION_UPDATED,
  YOUR_ROLE_UPDATED,
  OTHER_USER_ADDED,
  OTHER_USERS_ROLE_UPDATED,
  OTHER_USERS_LOCATION_UPDATED,
  OTHER_USER_WITHDRAWN_RIDE_REQUEST,
} from './constants';

export function requestRide(email: string, id: string) {
  return {
    type: USER_REQUESTED_RIDE,
    payload: {
      id,
      email,
    },
  };
}

export function receiveRideRequest(payload: any) {
  return {
    type: USER_RECEIVED_RIDE_REQUEST,
    payload,
  };
}

export function withdrawRideRequest() {
  return {
    type: USER_WITHDRAWN_RIDE_REQUEST,
  };
}

export function acceptUsersRideRequest(payload: any) {
  return {
    type: USERS_RIDE_REQUEST_GOT_ACCEPTED,
    payload,
  };
}

export function acceptRideRequest(payload: any, requesterId: string, notificationId: string) {
  return {
    type: USER_ACCEPTED_RIDE_REQUEST,
    payload: {
      payload,
      requesterId,
      notificationId,
    },
  };
}

export function loadTrip(tripState: any) {
  return {
    type: TRIP_LOADED,
    payload: tripState,
  };
}

export function completeTrip() {
  return {
    type: TRIP_COMPLETED,
  };
}

export function updateYourLocation(location: any) {
  return {
    type: YOUR_LOCATION_UPDATED,
    payload: {
      location,
    },
  };
}

export function updateYourRole(newRole: UsersRole) {
  return {
    type: YOUR_ROLE_UPDATED,
    payload: {
      newRole,
    },
  };
}

export function addOtherUser(userId: string, role: UsersRole) {
  return {
    type: OTHER_USER_ADDED,
    payload: {
      id: userId,
      role,
    },
  };
}

export function updateOtherUsersRole(userId: string, newRole: UsersRole) {
  return {
    type: OTHER_USERS_ROLE_UPDATED,
    payload: {
      userId,
      newRole,
    },
  };
}

export function updateOtherUsersLocation(userId: string, newLocation: Location) {
  return {
    type: OTHER_USERS_LOCATION_UPDATED,
    payload: {
      userId,
      newLocation,
    },
  };
}

export function otherUserWithdrawnRideRequest(otherUsersId: string) {
  return {
    type: OTHER_USER_WITHDRAWN_RIDE_REQUEST,
    payload: {
      userId: otherUsersId,
    },
  };
}
