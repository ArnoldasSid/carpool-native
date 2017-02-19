// @flow
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { async } from 'most-subject';

let initialized = false;
let isTracking = false;
let shouldStart = false;
let location$ = async();
let slowTrackingInterval;

const fastTrackingConfig = {
  desiredAccuracy: 0,
  // stationaryRadius: 50,
  // distanceFilter: 50,
  debug: false, // Enable/disable sounds
  startForeground: false,
  locationProvider: BackgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
  interval: 2 * 60 * 1000,
  fastestInterval: 2 * 60 * 1000,
  stopOnStillActivity: false,
  stopOnTerminate: true,
  syncThreshold: 50,
  maxLocations: 10,
};

export const initFastTracking = () => {
  console.log('Init fast tracking');
  if (!initialized) {
    BackgroundGeolocation.configure(fastTrackingConfig);

    BackgroundGeolocation.on('location', location => {
      console.log('Location detected', location);
      location$.next(location);
    });
    initialized = true;
  }
  return location$;
};

function startGeolocation() {
  console.log('Start geol');
  if (!isTracking) {
    BackgroundGeolocation.start(
      () => {
        isTracking = true;
      },
      error => {
        // Tracking has not started because of error
        // you should adjust your app UI for example change switch element to indicate
        // that service is not running
        if (error.code === 2) {
          BackgroundGeolocation.showAppSettings();
        } else {
          console.log('[ERROR] Start failed: ' + error.message);
        }
        isTracking = false;
      },
    );
  }
}

function checkIfGeolocationAvailable() {
  console.log('Should check if geo avail');
  return new Promise((resolve, reject) => {
    resolve();
    // BackgroundGeolocation.isLocationEnabled((enabled) => {
    //   if (enabled) {
    //     resolve()
    //   } else {
    //     // Location services are disabled
    //     BackgroundGeolocation.showLocationSettings()
    //
    //     shouldStart = true
    //     BackgroundGeolocation.watchLocationMode(geolocationEnabled => {
    //       if (geolocationEnabled && shouldStart) {
    //         shouldStart = false
    //         resolve()
    //       }
    //     })
    //   }
    // }, () => {})
  });
}

export function stopTracking() {
  // if (!isTracking) { return }

  clearInterval(slowTrackingInterval);

  shouldStart = false;
  BackgroundGeolocation.stop();
  isTracking = false;
}

export function getCurrLocation() {
  navigator.geolocation.getCurrentPosition(
    position => {
      location$.next(position.coords);
    },
    error => alert(JSON.stringify(error)),
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
  );
}

export function startSlowTracking() {
  checkIfGeolocationAvailable().then(() => {
    getCurrLocation();
    slowTrackingInterval = setInterval(
      () => {
        getCurrLocation();
      },
      2 * 60 * 1000,
    );
  });
  return location$;
}

export const switchToSlowTracking = () => {
  stopTracking();
  startSlowTracking();
  return location$;
};

export function startFastTracking() {
  BackgroundGeolocation.configure(fastTrackingConfig);
  if (isTracking) {
    return location$;
  }

  if (!initialized) {
    initFastTracking();
  }

  checkIfGeolocationAvailable().then(() => {
    startGeolocation();
  });

  return location$;
}

export const switchToFastTracking = () => {
  stopTracking();
  startFastTracking();
  return location$;
};
