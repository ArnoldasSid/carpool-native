import { ofType } from 'redux-observable-adapter-most';
import { merge, never } from 'most';
import {
  LOGOUT_SUCCEEDED,
} from '../auth/constants';
import {
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
} from '../currentTrip/constants';
import {
  START_BACKGROUND_TRACKING,
  STOP_BACKGROUND_TRACKING,
  USER_LOCATION_RECEIVED,
  USERS_LOCATION_SUBSCRIPTION_REQUESTED,
} from './constants';
import { startTracking, stopTracking } from '../../BackgroundGeolocationService'
import { saveLocation, subscribeToUsersLocation } from '../../api';

export default function currentTripEpic (action$, store) {
  const stopBackgroundTracking$ = ofType(STOP_BACKGROUND_TRACKING, action$);
  const logoutSuccess$ = ofType(LOGOUT_SUCCEEDED, action$);
  console.log(store.getState().auth.userId);

  const $1 = ofType(START_BACKGROUND_TRACKING, action$).chain(action => {
    const location$ = startTracking();
    location$
      .until(merge(stopBackgroundTracking$, logoutSuccess$))
      .subscribe({
        next: location => {
          saveLocation(location)
        },
      });
    return never();
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

  const usersRideAccepted$ = ofType(USERS_RIDE_REQUEST_GOT_ACCEPTED, action$)
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

  return merge($1, $2, userLocation$, usersRideAccepted$);
}