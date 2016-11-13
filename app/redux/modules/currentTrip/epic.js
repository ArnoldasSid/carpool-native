import { ofType } from 'redux-observable-adapter-most';
import { never, merge, just } from 'most';
import { requestRide, acceptRequest } from '../../api';
import {
  START_BACKGROUND_TRACKING,
  USERS_LOCATION_SUBSCRIPTION_REQUESTED,
} from '../locations/constants'
import {
  USER_REQUESTED_RIDE,
  USER_ACCEPTED_RIDE_REQUEST,
} from './constants';
import {
  ADD_SNACKBAR_MESSAGE,
} from '../snackbar/constants';

export default function currentTripEpic (action$) {
  const rideRequest$ = ofType(USER_REQUESTED_RIDE, action$)
    .chain(action =>
      requestRide(action.payload.userEmail, action.payload.userId)
        .chain(() =>
          merge(
            just({
              type: START_BACKGROUND_TRACKING,
            }),
            just({
              type: USERS_LOCATION_SUBSCRIPTION_REQUESTED,
            }),
            just({
              type: ADD_SNACKBAR_MESSAGE,
              payload: {
                text: 'Your ride request has been sent',
                duration: 4000,
              },
            })
          )
        )
    );

  const userRideRequestAccept$ = ofType(USER_ACCEPTED_RIDE_REQUEST, action$)
    .chain(action =>
      acceptRequest(action.payload.payload, action.payload.requesterId)
        .chain(() =>
          merge(
            just({
              type: START_BACKGROUND_TRACKING,
            }),
            just({
              type: USERS_LOCATION_SUBSCRIPTION_REQUESTED,
            })
          )
        )
    );

  return merge(rideRequest$, userRideRequestAccept$);
}