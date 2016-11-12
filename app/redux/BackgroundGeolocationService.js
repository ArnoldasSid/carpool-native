import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { subject } from 'most-subject';

let initialized = false;
let isTracking = false;
let location$ = subject();

export const initBackgroundGeolocation = () => {
  if (!initialized) {
    BackgroundGeolocation.configure({
      desiredAccuracy: 1,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false, // Enable/disable sounds
      startForeground: false,
      locationProvider: BackgroundGeolocation.provider.ANDROID_DISTANCE_FILTER_PROVIDER,
      interval: 5000,
      fastestInterval: 5000,
      stopOnStillActivity: false,
      stopOnTerminate: false,
      syncThreshold: 50,
      maxLocations: 100,
    });

    BackgroundGeolocation.on('location', (location) => {
      location$.next(location);
    });
    initialized = true;
  }
  return location$;
};

export const startTracking = () => {
  if (isTracking) {
    return location$;
  }

  if (!initialized) {
    initBackgroundGeolocation();
  }


  BackgroundGeolocation.isLocationEnabled((enabled) => {
    if (enabled) {
      BackgroundGeolocation.start(
        () => {
          isTracking = true;
        },
        (error) => {
          // Tracking has not started because of error
          // you should adjust your app UI for example change switch element to indicate
          // that service is not running
          if (error.code === 2) {
            BackgroundGeolocation.showAppSettings();
          } else {
            console.log('[ERROR] Start failed: ' + error.message);
          }
          isTracking = false;
        }
      );
    } else {
      // Location services are disabled
      BackgroundGeolocation.showLocationSettings();
    }
  });

  return location$;
};

export const stopTracking = () => {
  // if (!isTracking) { return; }

  BackgroundGeolocation.stop();
  isTracking = false;
};