// @flow
declare var jest: any
declare var describe: any
declare var it: any
declare var expect: any
declare var beforeEach: any

import createSagaMiddleware from 'redux-saga'
import configureStore from 'redux-mock-store'

jest.mock('../../../api.js')
import tripFlow from './trip.js'
import {
  requestRide,
  withdrawRideRequest,
  completeTrip,
  acceptRideRequest,
} from '../actions.js'
import {
  YOUR_ROLE_UPDATED,
  USERS_RIDE_REQUEST_GOT_ACCEPTED,
} from '../constants.js'
import { initialState } from '../reducer.js'

describe('trip flow', () => {
  let store

  beforeEach(() => {
      const sagaMiddleware = createSagaMiddleware()
      const mockStore = configureStore([sagaMiddleware])
      store = mockStore({ trip: initialState })
      sagaMiddleware.run(tripFlow)
  })

  describe('idle flow', () => {
    it('Updates role to rider after ride request', () => {
      store.dispatch(requestRide('email', 'id'))
      expect(store.getActions().some(action =>
        action.type === YOUR_ROLE_UPDATED
          && action.payload.newRole === 'REQUESTER'
      )).toBe(true)
    })
  })
  describe('requester flow', () => {
    beforeEach(() => {
      store.dispatch(requestRide('email', 'id'))
      store.clearActions()
    })

    it('Sets role to none after user withdraws ride request', () => {
      store.dispatch(withdrawRideRequest())
      expect(store.getActions().some(action =>
        action.type === YOUR_ROLE_UPDATED
          && action.payload.newRole === 'NONE'
      )).toBe(true)
    })

    it('Sets role to rider if request gets accepted', () => {
      store.dispatch({ type: USERS_RIDE_REQUEST_GOT_ACCEPTED })
      expect(store.getActions().some(action =>
        action.type === YOUR_ROLE_UPDATED
          && action.payload.newRole === 'RIDER'
      )).toBe(true)
    })

    it('Sets role to driver if user accepts ride request', () => {
      store.dispatch(acceptRideRequest({}, '', ''))
      expect(store.getActions().some(action =>
        action.type === YOUR_ROLE_UPDATED
          && action.payload.newRole === 'DRIVER'
      )).toBe(true)
    })
  })
  describe('rider flow', () => {
    beforeEach(() => {
      store.dispatch(requestRide('email', 'id'))
      store.dispatch({ type: USERS_RIDE_REQUEST_GOT_ACCEPTED })
      store.clearActions()
    })

    it('Sets role to none after user completes trip', () => {
      store.dispatch(completeTrip())
      expect(store.getActions().some(action =>
        action.type === YOUR_ROLE_UPDATED
          && action.payload.newRole === 'NONE'
      )).toBe(true)
    })
  })
  describe('driver flow', () => {
    beforeEach(() => {
      store.dispatch(acceptRideRequest({}, '', ''))
      store.clearActions()
    })

    it('Sets role to none after user completes trip', () => {
      store.dispatch(completeTrip())
      expect(store.getActions().some(action =>
        action.type === YOUR_ROLE_UPDATED
          && action.payload.newRole === 'NONE'
      )).toBe(true)
    })
  })
})
