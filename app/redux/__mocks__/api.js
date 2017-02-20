import { async } from 'most-subject';
import { eventChannel, channel } from 'redux-saga';
import { race, put, fork, take } from 'redux-saga/effects';

import { LOGIN_SUCCEEDED } from '../modules/auth/constants.js';

export const requestRide = jest.fn();
export const acceptRequest = jest.fn();

const location$ = async();

function streamToChan(stream) {
  return eventChannel(emitter => {
    const sub = stream.subscribe({
      next: emitter,
    });

    return () => {
      sub.unsubscribe();
    };
  });
}

function* subChan(chan, ...params) {
  let stream;
  try {
    while (true) {
      stream = location$;
      const streamChan = streamToChan(stream);
      while (true) {
        const rez = yield race({
          ddpConn: take(LOGIN_SUCCEEDED),
          val: take(streamChan),
        });
        if (rez.ddpConn) {
          break;
        } else if (rez.val) {
          yield put(chan, rez.val);
        }
      }
    }
  } finally {
  }
}

export function* subscribeToUsersLocation() {
  const chan = channel();
  const task = yield fork(subChan, chan);
  return {
    chan,
    task,
  };
}

export function sendLocation(location = { latitude: Math.random(), longitude: Math.random() }) {
  location$.next({
    msg: 'added',
    fields: {
      0: location,
    },
  });
  return location;
}

export const unsub = jest.fn();
