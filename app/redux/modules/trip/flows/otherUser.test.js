// @flow
declare var jest: any
declare var describe: any
declare var it: any
declare var expect: any
declare var beforeEach: any

import createSagaMiddleware from 'redux-saga'
import configureStore from 'redux-mock-store'

jest.mock('../../../api.js')
import otherUserFlow from './otherUser'
import tripReducer, { initialState } from '../reducer.js'
import {
  receiveRideRequest,
  acceptUsersRideRequest,
  completeTrip,
  acceptRideRequest,
} from '../actions.js'
import {
  OTHER_USER_ADDED,
  OTHER_USERS_LOCATION_UPDATED,
  OTHER_USERS_ROLE_UPDATED,
} from '../constants.js'
import { sendLocation } from '../../../api.js'
import { combineReducers } from 'redux'

function getMockStore (initialTripState = { trip: initialState }) {
  const sagaMiddleware = createSagaMiddleware()
  const mockStore = configureStore([sagaMiddleware])
  const store = mockStore({ trip: initialTripState })
  sagaMiddleware.run(otherUserFlow)
  store.replaceReducer(combineReducers({ trip: tripReducer }))
  return store
}

function checkIfLocationReceived (userId: string, store: any) {
  store.clearActions()
  const location = sendLocation()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const locationReceived = store.getActions().some(action =>
        action.type === OTHER_USERS_LOCATION_UPDATED
          && action.payload.newLocation === location
          && action.payload.userId === userId
      )
      resolve(locationReceived)
    })
  })
}

describe('other user flow', () => {
  describe('Received a ride request', () => {
    it('If it is a new user he is added to other users and his locations are updated', () => {
      const store = getMockStore()
      const requesterId = 'requesterID'
      store.dispatch(receiveRideRequest({ userId: requesterId }))

      expect(store.getActions().some(action =>
        action.type === OTHER_USER_ADDED
          && action.payload.id === requesterId
          && action.payload.role === 'REQUESTER'
      )).toBe(true)

      return checkIfLocationReceived(requesterId, store)
        .then(locationReceived => expect(locationReceived).toBe(true))
    })

    it('If user is already in otherUsers the request is ignored', () => {
      const requesterId = 'requesterID'
      const store = getMockStore({ otherUsers: { [requesterId]: { id: requesterId } } })
      store.dispatch(receiveRideRequest({ userId: requesterId }))
      expect(store.getActions().length).toBe(1)
    })

    describe('Current users ride request gets accepted by other user', () => {
      it('If other user wasn\'t in otherUsers he should be added', () => {
        const driverId = 'driverId'
        const store = getMockStore()
        store.dispatch(acceptUsersRideRequest({ userId: driverId }))
        expect(store.getActions().some(action =>
          action.type === OTHER_USER_ADDED
            && action.payload.id === driverId
            && action.payload.role === 'DRIVER'
        )).toBe(true)
      })

      it('That other user should get his role changed to driver', () => {
        const driverId = 'driverId'
        const store = getMockStore()
        store.dispatch(receiveRideRequest({ userId: driverId }))
        store.dispatch(acceptUsersRideRequest({ userId: driverId }))
        expect(store.getActions().some(action =>
          action.type === OTHER_USERS_ROLE_UPDATED
            && action.payload.userId === driverId
            && action.payload.newRole === 'DRIVER'
        )).toBe(true)
      })

      it('After trip completes other users location subscription should get cancelled', () => {
        const driverId = 'driverId'
        const store = getMockStore()
        store.dispatch(receiveRideRequest({ userId: driverId }))
        store.dispatch(acceptUsersRideRequest({ userId: driverId }))
        return checkIfLocationReceived(driverId, store)
          .then(locationReceived => {
            expect(locationReceived).toBe(true)
            store.dispatch(completeTrip())
            return checkIfLocationReceived(driverId, store)
          }).then(locationReceived => expect(locationReceived).toBe(false))
      })
    })

    describe('Other user is a requester and gets his ride accepted by current user', () => {
      it('If other user is requester his role should be changed to rider', () => {
        const riderId = 'riderId'
        const store = getMockStore()
        store.dispatch(receiveRideRequest({ userId: riderId }))
        store.dispatch(acceptRideRequest({}, riderId, ''))
        expect(store.getActions().some(action =>
          action.type === OTHER_USERS_ROLE_UPDATED
            && action.payload.userId === riderId
            && action.payload.newRole === 'RIDER'
        )).toBe(true)
      })

      it('After trip is completed other users location should not be tracked anymore', () => {
        const riderId = 'riderId'
        const store = getMockStore()
        store.dispatch(receiveRideRequest({ userId: riderId }))
        store.dispatch(acceptRideRequest({}, riderId, ''))
        return checkIfLocationReceived(riderId, store)
          .then(locationReceived => {
            expect(locationReceived).toBe(true)
            store.dispatch(completeTrip())
            return checkIfLocationReceived(riderId, store)
          }).then(locationReceived => expect(locationReceived).toBe(false))
      })
    })
  })
})
