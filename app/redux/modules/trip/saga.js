// @flow
import { fork, IOEffect } from 'redux-saga/effects'

import backgroundTrackingFlow from './flows/backgroundTracking.js'
import tripFlow from './flows/trip.js'
import tripTimeoutFlow from './flows/tripTimeout.js'
import tripSavingFlow from './flows/tripSaving.js'
import tripInitFlow from './flows/tripInit.js'
import otherUserFlow from './flows/otherUser.js'

export default function* tripSaga (): Generator<IOEffect, *, *> {
  yield [
    fork(backgroundTrackingFlow),
    fork(tripFlow),
    fork(tripTimeoutFlow),
    fork(tripSavingFlow),
    fork(tripInitFlow),
    fork(otherUserFlow),
  ]
}
