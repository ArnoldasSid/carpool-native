// @flow
import { fork, take, call, race, cancel, put } from 'redux-saga/effects'
import { channel } from 'redux-saga'
import moment from 'moment'

import { subscribeToNotifications, markNotificationAsRead } from '../../api'
import {
  DDP_CONNECTED,
} from '../app/constants.js'
import {
  LOGIN_SUCCEEDED,
  REGISTRATION_SUCCEEDED,
  AUTH_INFO_LOADED,
  LOGOUT_SUCCEEDED,
} from '../auth/constants'
import { receiveRideRequest } from '../trip/actions'
import { acceptUsersRideRequest } from '../trip/actions.js'
import {
  NOTIFICATIONS_SUB_READY,
  NOTIFICATION_RECEIVED,
  NOTIFICATION_UPDATED,
  MARK_NOTIFICATION_AS_READ_REQUESTED,
} from './constants'

function* handleNotificationMsg (msg) {
  if (msg.msg === 'ready') {
    yield put({
      type: NOTIFICATIONS_SUB_READY,
    })
  } else if (msg.msg === 'added') {
    // Ignore old notifications
    if (msg.fields.action === 'requestRide' || msg.fields.action === 'acceptRideRequest') {
      const timeAfterNotification = moment().valueOf() - msg.fields.tss.$date
      if (timeAfterNotification > 90 * 60 * 1000) {
        return
      }
    }

    yield put({
      type: NOTIFICATION_RECEIVED,
      payload: {
        id: msg.id,
        ...msg.fields,
      },
    })

    if (msg.fields.action === 'requestRide' && !msg.fields.recievedAt) {
      yield put(receiveRideRequest(msg.fields.payload))
    }
    //  && store.getState().notifications.subReady
    if (msg.fields.action === 'acceptRideRequest' && !msg.fields.recievedAt) {
      yield put(acceptUsersRideRequest(msg.fields.payload))
    }
  } else if(msg.msg === 'changed') {
    yield put({
      type: NOTIFICATION_UPDATED,
      payload: {
        id: msg.id,
        updates: msg.fields,
      },
    })
  }
}

function* notificationsSubFlow () {
  while (true) {
    yield race({
      login: take(LOGIN_SUCCEEDED),
      register: take(REGISTRATION_SUCCEEDED),
    })

    // const r = yield call(subscribeToNotifications)
    const r = yield* subscribeToNotifications()
    const chan = yield call(channel)
    console.log('chan2', chan)
    console.log('R', r)
    if (r) {
      const { chan, task } = r
      while (true) {
        const rez = yield race({
          val: take(chan),
          logout: take(LOGOUT_SUCCEEDED),
        })

        if (rez && rez.val) {
          yield* handleNotificationMsg(rez.val)
        } else if (rez && rez.logout) {
          yield cancel(task)
          break
        }
      }
    }
  }
}

function* markNotificationAsReadFlow () {
  while (true) {
    const action = yield take(MARK_NOTIFICATION_AS_READ_REQUESTED)
    yield call(markNotificationAsRead, action.payload.notificationId)
  }
}

export default function* notificationsSaga (): Generator<any, *, *> {
  console.log('Saga running')
  yield [
    fork(notificationsSubFlow),
    fork(markNotificationAsReadFlow),
  ]
}
