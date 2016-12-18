import { async } from 'most-subject'

export const requestRide = jest.fn()
export const acceptRequest = jest.fn()

const location$ = async()
export const subscribeToUsersLocation = jest.fn(() => ({
  subId: 0,
  location$: location$,
}))

export function sendLocation (location = {latitude: Math.random(), longitude: Math.random()}) {
  location$.next({
    msg: 'added',
    fields: {
      loc: location,
    },
  })
  return location
}

const unsub = jest.fn()
