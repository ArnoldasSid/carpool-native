import { async } from 'most-subject'

let isTracking = false
let location$ = async()
let watchId = null

export const startTracking = (trackingInterval) => {
  if (isTracking) {
    return location$
  }

  watchId = navigator.geolocation.watchPosition((loc) => {
    location$.next(loc.coords)
  }, (err) => {
    alert(err)
  }, {
    timeout: 1000,
    maximumAge: 60000,
    enableHighAccuracy: false,
    distanceFilter: 10,
  })
  isTracking = false

  return location$
}

export const stopTracking = () => {
  navigator.geolocation.clearWatch(watchId)
}

export const switchToSlowTracking = () => {

  stopTracking()

  return startTracking()
}

export const switchToFastTracking = () => {

  stopTracking()

  return startTracking()
}
