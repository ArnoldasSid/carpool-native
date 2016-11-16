import { ofType } from 'redux-observable-adapter-most';
import { merge, never, periodic, just } from 'most';
import {
  LOGOUT_SUCCEEDED,
} from '../auth/constants';
import {
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
  USER_ACCEPTED_RIDE_REQUEST,
} from '../currentTrip/constants';
import {
  START_BACKGROUND_TRACKING,
  STOP_BACKGROUND_TRACKING,
  USER_LOCATION_RECEIVED,
  USERS_LOCATION_SUBSCRIPTION_REQUESTED,
} from './constants';
import { startTracking, stopTracking } from '../../BackgroundGeolocationService'
import { saveLocation, subscribeToUsersLocation } from '../../api';

export default function locationsEpic (action$, store) {
  const stopBackgroundTracking$ = ofType(STOP_BACKGROUND_TRACKING, action$);
  const logoutSuccess$ = ofType(LOGOUT_SUCCEEDED, action$);

  const $1 = ofType(START_BACKGROUND_TRACKING, action$).chain(action => {
    const location$ = startTracking();
    location$
      .until(merge(stopBackgroundTracking$, logoutSuccess$))
      .subscribe({
        next: location => {
          saveLocation(location)
        },
      });

    return never().startWith({
      type: STOP_BACKGROUND_TRACKING
    }).delay(30 * 60 * 1000);
  });

  const $2 = ofType(STOP_BACKGROUND_TRACKING, LOGOUT_SUCCEEDED, action$).chain(action => {
    stopTracking();
    return never();
  });

  const userLocation$ = ofType(USERS_LOCATION_SUBSCRIPTION_REQUESTED, action$)
    .chain(action => {
      console.log('Subscribing to users location');
      return subscribeToUsersLocation(store.getState().auth.userId)
        .filter(msg => msg.msg === 'added')
        .map(msg => ({
          type: USER_LOCATION_RECEIVED,
          payload: {
            userId: msg.fields.userId,
            location: msg.fields.loc,
          },
        })).until(logoutSuccess$);
    });

  const otherUserLocation$ =
    merge(
      ofType(USERS_RIDE_REQUEST_GOT_ACCEPTED, action$),
      ofType(USER_ACCEPTED_RIDE_REQUEST, action$)
        .map(action => {action.payload.userId = action.payload.requesterId; return action})
    )
      .chain(action => {
        return subscribeToUsersLocation(action.payload.userId)
          .filter(msg => msg.msg === 'added')
          .map(msg => ({
            type: USER_LOCATION_RECEIVED,
            payload: {
              userId: msg.fields.userId,
              location: msg.fields.loc,
            },
          })).until(logoutSuccess$);
      });

  return merge($1, $2, userLocation$, otherUserLocation$);
}
