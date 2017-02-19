// @flow
import { AsyncStorage } from 'react-native';
import { put, PutEffect } from 'redux-saga/effects';

import { loadTrip } from '../actions.js';

export default function* tripInitFlow(): Generator<PutEffect, *, *> {
  const lsTripString = yield AsyncStorage.getItem('currentTrip');
  if (!lsTripString) return;
  const lsTrip = JSON.parse(lsTripString);
  const tripTime = lsTrip.lastUpdateTime;
  const currTime = new Date().valueOf();
  if (tripTime && currTime - tripTime < 15 * 60 * 1000) {
    yield put(loadTrip(lsTrip));
  }
}
