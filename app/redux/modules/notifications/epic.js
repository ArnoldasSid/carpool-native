import { merge, just, empty } from 'most';
import { subscribeToNotifications, markNotificationAsRead } from '../../api';
import { ofType } from 'redux-observable-adapter-most';
import {
  LOGIN_SUCCEEDED,
  REGISTRATION_SUCCEEDED,
  AUTH_INFO_LOADED,
  LOGOUT_SUCCEEDED
} from '../auth/constants'
import {
  USER_RECEIVED_RIDE_REQUEST,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
} from '../currentTrip/constants';
import {
  NOTIFICATIONS_SUB_READY,
  NOTIFICATION_RECEIVED,
  NOTIFICATION_UPDATED,
  MARK_NOTIFICATION_AS_READ_REQUESTED,
} from './constants';

export default function notificationsEpic (action$) {

  const authSuccess$ = ofType(LOGIN_SUCCEEDED, REGISTRATION_SUCCEEDED, AUTH_INFO_LOADED, action$);
  const logoutSuccess$ = ofType(LOGOUT_SUCCEEDED, action$);

  const notificationsSubscription$ = authSuccess$
    .chain(action =>
      subscribeToNotifications()
        .chain(msg => {
          if (msg.msg === 'ready') {
            return just({
              type: NOTIFICATIONS_SUB_READY,
            });
          } else if (msg.msg === 'added') {
            const notificationReceived$ = just({
              type: NOTIFICATION_RECEIVED,
              payload: {
                id: msg.id,
                ...msg.fields,
              }
            });
            const actionsToDispatch = [notificationReceived$]
            if (msg.fields.action === 'requestRide' && !msg.fields.recievedAt) {
              actionsToDispatch.push(just({
                type: USER_RECEIVED_RIDE_REQUEST,
                payload: msg.fields.payload,
              }));
            }
            if (msg.fields.action === 'acceptRideRequest' && !msg.fields.recievedAt) {
              actionsToDispatch.push(just({
                type: USERS_RIDE_REQUEST_GOT_ACCEPTED,
                payload: msg.fields.payload,
              }));
            }

            return merge(...actionsToDispatch);
          } else if(msg.msg === 'changed') {
            return just({
              type: NOTIFICATION_UPDATED,
              payload: {
                id: msg.id,
                updates: msg.fields,
              }
            });
          }
        }).until(logoutSuccess$)
    );

  const notificationRead$ = ofType(MARK_NOTIFICATION_AS_READ_REQUESTED, action$)
    .chain(action => {
      markNotificationAsRead(action.payload.notificationId);
      return empty();
    });

  return merge(notificationsSubscription$, notificationRead$);
}
