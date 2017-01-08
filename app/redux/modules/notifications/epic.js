import { merge, just, empty } from 'most'
import { subscribeToNotifications, markNotificationAsRead } from '../../api'
import { ofType } from 'redux-observable-adapter-most'
import moment from 'moment'

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

export default function notificationsEpic (action$, store) {

  const authSuccess$ = ofType(LOGIN_SUCCEEDED, REGISTRATION_SUCCEEDED, AUTH_INFO_LOADED, action$)
  const logoutSuccess$ = ofType(LOGOUT_SUCCEEDED, action$)
  const reconnect$ = ofType(DDP_CONNECTED, action$).skip(1)

  const notificationsSubscription$ = merge(authSuccess$, reconnect$)
    .chain(action =>
      subscribeToNotifications()
        .chain(msg => {
          if (msg.msg === 'ready') {
            return just({
              type: NOTIFICATIONS_SUB_READY,
            })
          } else if (msg.msg === 'added') {
            // Ignore old notifications
            if (msg.fields.action === 'requestRide' || msg.fields.action === 'acceptRideRequest') {
              const timeAfterNotification = moment().valueOf() - msg.fields.tss.$date
              if (timeAfterNotification > 90 * 60 * 1000) {
                return empty()
              }
            }

            const notificationReceived$ = just({
              type: NOTIFICATION_RECEIVED,
              payload: {
                id: msg.id,
                ...msg.fields,
              },
            })
            const actionsToDispatch = [notificationReceived$]

            if (msg.fields.action === 'requestRide' && !msg.fields.recievedAt) {
              actionsToDispatch.push(just(receiveRideRequest(msg.fields.payload)))
            }
            //  && store.getState().notifications.subReady
            if (msg.fields.action === 'acceptRideRequest' && !msg.fields.recievedAt) {
              actionsToDispatch.push(just(acceptUsersRideRequest(msg.fields.payload)))
            }

            return merge(...actionsToDispatch)
          } else if(msg.msg === 'changed') {
            return just({
              type: NOTIFICATION_UPDATED,
              payload: {
                id: msg.id,
                updates: msg.fields,
              },
            })
          }
        }).until(logoutSuccess$)
    )

  ofType(MARK_NOTIFICATION_AS_READ_REQUESTED, action$)
    .tap(console.log.bind(console))
    .observe(action => {
      markNotificationAsRead(action.payload.notificationId)
    })

  return merge(notificationsSubscription$)
}
