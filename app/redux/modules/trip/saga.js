import { put, take, race, fork, cancel, cancelled, call } from 'redux-saga/effects';
import { fromPromise } from 'most';

import { startTracking, stopTracking } from '../../BackgroundGeolocationService';
import { saveLocation, subscribeToUsersLocation, unsub, acceptRequest, requestRide } from '../../api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

import {
  FAST_TRACKING_STARTED,
  FAST_TRACKING_STOPPED,
  USER_REQUESTED_RIDE,
  USER_RECEIVED_RIDE_REQUEST,
  USER_ACCEPTED_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,

  TRIP_COMPLETED,
  USER_WITHDRAWN_RIDE_REQUEST,
  USER_DATA_UPDATED,
  DRIVER_DATA_UPDATED,
  RIDER_DATA_UPDATED,
  USERS_ROLE_UPDATED,
  REQUESTER_DATA_UPDATED,
} from './constants';

import {
  LOGOUT_SUCCEEDED,
  LOGIN_SUCCEEDED,
  REGISTRATION_SUCCEEDED,
} from '../auth/constants';

import {
  MARK_NOTIFICATION_AS_READ_REQUESTED,
} from '../notifications/constants';

function* enableFastTracking () {
  try {
    const location$ = startTracking();
    let prevLocation = null;
    let currLocation = null;

    location$.observe((location) => {
      currLocation = location;
    });

    while (true) {
      if (currLocation !== prevLocation) {
        prevLocation = currLocation;
        saveLocation({
          ...currLocation,
          // latitude: 54.6872 + Math.random() * 0.08 - 0.04,
          // longitude: 25.2797 + Math.random() * 0.08 - 0.04,
        })
      }
      yield delay(1500);
    }
  } finally {
    if (yield cancelled()) {
      stopTracking();
    }
  }
}

function* fastTrackingFlow () {
  // Should start when slowTrackingStops
  while(true) {
    yield race({
      userRequestedRide: take(USER_REQUESTED_RIDE),
      userAcceptedRideRequest: take(USER_ACCEPTED_RIDE_REQUEST),
    });

    const fastTrackingTask = yield fork(enableFastTracking);
    yield put({
      type: FAST_TRACKING_STARTED,
    });

    yield race({
      tripCompleted: take(TRIP_COMPLETED),
      userWithdrawnRideRequest: take(USER_WITHDRAWN_RIDE_REQUEST),
      loggedOut: take(LOGOUT_SUCCEEDED),
    });

    cancel(fastTrackingTask);
    yield put({
      type: FAST_TRACKING_STOPPED,
    });
  }
}

function* saveUsersLocation () {
  const slowTrackingUpdateRate = 30 * 1000;

  try {
    while (true) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          saveLocation({
            ...position.coords,
            // latitude: 54.6872 + Math.random() * 0.08 - 0.04,
            // longitude: 25.2797 + Math.random() * 0.08 - 0.04,
          });
        },
        (error) => console.log(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: slowTrackingUpdateRate, maximumAge: slowTrackingUpdateRate}
      );
      yield delay(slowTrackingUpdateRate);
    }
  } finally {
    if (yield cancelled()) {
      // Place for cleanup
    }
  }
}

function* slowTrackingFlow () {

  while (true) {
    yield race({
      login: take(LOGIN_SUCCEEDED),
      register: take(REGISTRATION_SUCCEEDED),
      fastTrackingStop: take(FAST_TRACKING_STOPPED),
    });

    const slowTrackingTask = yield fork(saveUsersLocation);

    yield race({
      logout: take(LOGOUT_SUCCEEDED),
      fastTrackingStart: take(FAST_TRACKING_STARTED)
    });

    yield cancel(slowTrackingTask);
  }
}

function* subscribeToUsersData(id, email, updateActionType) {
  const { subId, location$ } = subscribeToUsersLocation(id);

  try {
    let prevLocation = null;
    let currLocation = null;

    location$
      .filter(msg => msg.msg === 'added')
      .map(msg => msg.fields.loc)
      .observe((location) => {
        currLocation = location;
      });

    while (true) {
      if (currLocation !== prevLocation) {
        prevLocation = currLocation;
        yield put({
          type: updateActionType,
          payload: {
            id,
            email,
            location: currLocation,
          }
        });
      }
      yield delay(1500);
    }
  } finally {
    if (yield cancelled()) {
      unsub(subId);
    }
  }
}

function* userDataFlow () {
  const { loginData, registerData } = yield race({
    loginData: take(LOGIN_SUCCEEDED),
    registerData: take(REGISTRATION_SUCCEEDED),
  });

  const authData = loginData || registerData;
  const userDataUpdateTask = yield fork(subscribeToUsersData, authData.payload.id, authData.payload.email, USER_DATA_UPDATED);

  yield take(LOGOUT_SUCCEEDED);
  cancel(userDataUpdateTask);
}

function* driverDataFlow () {
  while (true) {
    const action = yield take(USERS_RIDE_REQUEST_GOT_ACCEPTED);

    const driverData = {
      id: action.payload.userId,
      email: action.payload.userEmail,
    };

    const driverDataUpdateTask = yield fork(subscribeToUsersData, driverData.id, driverData.email, DRIVER_DATA_UPDATED);

    yield race({
      logout: take(LOGOUT_SUCCEEDED),
      tripComplete: take(TRIP_COMPLETED),
    });
    cancel(driverDataUpdateTask);
  }
}

function* ridersDataFlow () {
  while (true) {
    const actionData = yield take(USER_ACCEPTED_RIDE_REQUEST);

    // TODO: Move this to notifications saga
    const notificationId = actionData.payload.notificationId;
    yield put({
      type: MARK_NOTIFICATION_AS_READ_REQUESTED,
      payload: {
        notificationId,
      },
    });

    const requesterId = actionData.payload.requesterId;

    yield put({
      type: RIDER_DATA_UPDATED,
      payload: {
        id: requesterId,
      },
    });

    // yield fork(subscribeToUsersData, requesterId, null, RIDER_DATA_UPDATED);
  }
}

function* requestersDataFlow () {
  while (true) {
    const rideRequestAction = yield take(USER_RECEIVED_RIDE_REQUEST);
    // Should unsub if user accepts this requester or if user becomes rider himself
    yield fork(subscribeToUsersData, rideRequestAction.payload.userId, rideRequestAction.payload.userEmail, REQUESTER_DATA_UPDATED);
  }
}

function* usersRoleFlow () {
  while (true) {
    // Start of role flow, user status here should always be none
    const { userRequestedRide, userAcceptedRequest } = yield race({
      userRequestedRide: take(USER_REQUESTED_RIDE),
      userAcceptedRequest: take(USER_ACCEPTED_RIDE_REQUEST),
    });

    if (userRequestedRide) {
      yield fork(requestRide, userRequestedRide.payload.userEmail, userRequestedRide.payload.userId);
      // TODO: Fork ride request
      yield put({
        type: USERS_ROLE_UPDATED,
        payload: {
          newRole: 'REQUESTER',
        },
      });
      const { userWithdrawnRequest, usersRequestGotAccepted } = yield race({
        userWithdrawnRequest: take(USER_WITHDRAWN_RIDE_REQUEST),
        usersRequestGotAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
      });

      if (userWithdrawnRequest) {
        yield put({
          type: USERS_ROLE_UPDATED,
          payload: {
            newRole: 'NONE',
          },
        });
      } else if (usersRequestGotAccepted) {
        yield put({
          type: USERS_ROLE_UPDATED,
          payload: {
            newRole: 'RIDER',
          },
        });
        yield take(TRIP_COMPLETED);
        yield put({
          type: USERS_ROLE_UPDATED,
          payload: {
            newRole: 'NONE',
          },
        });
      }
    } else if (userAcceptedRequest) {
      yield fork (acceptRequest, userAcceptedRequest.payload.payload, userAcceptedRequest.payload.requesterId);
      yield put({
        type: USERS_ROLE_UPDATED,
        payload: {
          newRole: 'DRIVER',
        },
      });
      yield take(TRIP_COMPLETED);
      yield put({
        type: USERS_ROLE_UPDATED,
        payload: {
          newRole: 'NONE',
        },
      });
    }
  }
}

export default function* tripSaga (getState) {
  yield [
    fork(fastTrackingFlow),
    fork(slowTrackingFlow),
    fork(userDataFlow),
    fork(driverDataFlow),
    fork(ridersDataFlow),
    fork(requestersDataFlow),
    fork(usersRoleFlow),
  ];
}