// @flow
import { AsyncStorage } from 'react-native';
import { select, race, take, fork, TakeEffect } from 'redux-saga/effects';

import { LOGOUT_SUCCEEDED } from '../../auth/constants.js';

import {
  USER_REQUESTED_RIDE,
  USER_ACCEPTED_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
  TRIP_COMPLETED,
  USER_WITHDRAWN_RIDE_REQUEST,
} from '../constants.js';

function* saveTripToLocalstorage() {
  const trip = yield select(state => state.trip);
  AsyncStorage.setItem('currentTrip', JSON.stringify(trip));
}

export default function* tripSavingFlow(): Generator<TakeEffect, *, *> {
  while (true) {
    yield race({
      logout: take(LOGOUT_SUCCEEDED),
      rideRequest: take(USER_REQUESTED_RIDE),
      acceptRideRequest: take(USER_ACCEPTED_RIDE_REQUEST),
      rideRequestAccepted: take(USERS_RIDE_REQUEST_GOT_ACCEPTED),
      tripCompleted: take(TRIP_COMPLETED),
      rideRequestWithdraw: take(USER_WITHDRAWN_RIDE_REQUEST),
    });

    yield fork(saveTripToLocalstorage);
  }
}
