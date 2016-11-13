import { merge, just, concat, empty } from 'most';
import { subscribeToNotifications, markNotificationAsRead } from '../../api';
import { ofType } from 'redux-observable-adapter-most';
import {
  LOGIN_SUCCEEDED,
  REGISTRATION_SUCCEEDED,
  AUTH_INFO_LOADED,
  LOGOUT_SUCCEEDED
} from '../auth/constants'
import {
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

            if (msg.fields.action === 'acceptRideRequest' && !msg.fields.recievedAt) {
              return concat(
                just({
                  type: USERS_RIDE_REQUEST_GOT_ACCEPTED,
                  payload: msg.fields.payload,
                }),
                notificationReceived$
              )
            }

            return notificationReceived$;
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