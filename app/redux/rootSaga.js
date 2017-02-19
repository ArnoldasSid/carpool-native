// @flow
import { fork } from 'redux-saga/effects';

import notificationsSaga from './modules/notifications/saga';
import tripSaga from './modules/trip/saga';

export default function* rootSaga(): Generator<*, *, *> {
  return [yield fork(notificationsSaga), yield fork(tripSaga)];
}
