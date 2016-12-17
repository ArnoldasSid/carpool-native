import BackgroundGeolocation from 'react-native-mauron85-background-geolocation'
import { subject } from 'most-subject'

let initialized = false
let isTracking = false
let shouldStart = false
let location$ = subject()

const commonConfig = {
  desiredAccuracy: 0,
  // stationaryRadius: 50,
  // distanceFilter: 50,
  debug: false, // Enable/disable sounds
  startForeground: false,
  locationProvider: BackgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
  interval:  2 * 60 * 1000,
  fastestInterval: 2 * 60 * 1000,
  stopOnStillActivity: false,
  stopOnTerminate: true,
  syncThreshold: 50,
  maxLocations: 10,
}

export const initBackgroundGeolocation = () => {
  if (!initialized) {
    BackgroundGeolocation.configure(commonConfig)

    BackgroundGeolocation.on('location', (location) => {
      console.log('Location detected', location)
      location$.next(location)
    })
    initialized = true
  }
  return location$
}

function startGeolocation () {
  if (!isTracking) {
    BackgroundGeolocation.start(
      () => {
        isTracking = true
      },
      (error) => {
        // Tracking has not started because of error
        // you should adjust your app UI for example change switch element to indicate
        // that service is not running
        if (error.code === 2) {
          BackgroundGeolocation.showAppSettings()
        } else {
          console.log('[ERROR] Start failed: ' + error.message)
        }
        isTracking = false
      }
    )
  }
}

export const startTracking = () => {
  if (isTracking) {
    return location$
  }

  if (!initialized) {
    initBackgroundGeolocation()
  }


  BackgroundGeolocation.isLocationEnabled((enabled) => {
    if (enabled) {
      startGeolocation()
    } else {
      // Location services are disabled
      BackgroundGeolocation.showLocationSettings()

      shouldStart = true
      BackgroundGeolocation.watchLocationMode(geolocationEnabled => {
        if (geolocationEnabled && shouldStart) {
          shouldStart = false
          startGeolocation()
        }
      })
    }
  })

  return location$
}

export const stopTracking = () => {
  // if (!isTracking) { return }

  shouldStart = false
  BackgroundGeolocation.stop()
  isTracking = false
}

export const switchToSlowTracking = () => {

  stopTracking()

  BackgroundGeolocation.configure({
    ...commonConfig,
  })

  startTracking()
}

export const switchToFastTracking = () => {

  stopTracking()

  BackgroundGeolocation.configure({
    ...commonConfig,
    interval: 10 * 1000,
    fastestInterval: 5 * 1000,
  })

  startTracking()
}
