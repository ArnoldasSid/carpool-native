import { async } from 'most-subject'

let location$ = async()
let watchId = null
let slowTrackingInterval

export function getCurrLocation () {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      location$.next(position.coords)
    },
    (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
  )
}

export const startTracking = (distanceFilter = 20) => {
  watchId = navigator.geolocation.watchPosition((loc) => {
    location$.next(loc.coords)
  }, (err) => {
    alert(err)
  }, {
    timeout: 1000,
    maximumAge: 60000,
    enableHighAccuracy: true,
    distanceFilter: distanceFilter,
  })

  return location$
}

export const stopTracking = () => {
  clearInterval(slowTrackingInterval)
  navigator.geolocation.clearWatch(watchId)
}

export const startSlowTracking = () => {
  getCurrLocation()
  slowTrackingInterval = setInterval(() => {
    getCurrLocation()
  }, 2 * 60 * 1000)
  return location$
}

export const startFastTracking = () => {
  startTracking(10)
  return location$
}

export const switchToSlowTracking = () => {
  stopTracking()
  startSlowTracking()
  return location$
}

export const switchToFastTracking = () => {
  stopTracking()
  startFastTracking()
  return location$
}
