import React from 'react';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

export default class BackgroundGeolocationController extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      region: null,
      locations: [],
      isTracking: false,
    };
  }

  componentWillMount() {
    function logError (msg) {
      console.log(`[ERROR] getLocations: ${msg}`);
    }

    function handleHistoricLocations (locations) {
      let region = {};
      const now = Date.now();
      const latitudeDelta = 0.01;
      const longitudeDelta = 0.01;
      const sameDayDiffInMillis = 24 * 3600 * 1000;
      const currentLocations = this.state.locations.slice(0);
      let locationsCount = currentLocations.length;

      locations.forEach((location, idx) => {
        if ((now - location.time) <= sameDayDiffInMillis) {
          region = Object.assign({}, location, { latitudeDelta, longitudeDelta });
          const histLocation = Object.assign({}, location, { key: locationsCount++ });
          console.log('[DEBUG] historic location', histLocation.key);
          currentLocations.push(histLocation);
        }
      });
      if (currentLocations.length > 0) {
        this.setState({ locations: currentLocations, region });
      }
    }

    BackgroundGeolocation.getLocations(handleHistoricLocations.bind(this), logError);
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false, // Enable/disable sounds
      locationProvider: BackgroundGeolocation.provider.ANDROID_DISTANCE_FILTER_PROVIDER,
      interval: 5000,
      fastestInterval: 5000,
      stopOnStillActivity: false,
      stopOnTerminate: false,
      url: 'http://192.168.81.15:3000/locations',
      syncThreshold: 50,
      maxLocations: 100,
      httpHeaders: {
        'X-FOO': 'bar'
      }
    });

    BackgroundGeolocation.on('location', (location) => {
      console.log('[DEBUG] BackgroundGeolocation location', location);
      const longitudeDelta = 0.01;
      const latitudeDelta = 0.01;
      const region = Object.assign({}, location, { latitudeDelta, longitudeDelta });
      const locations = this.state.locations.slice(0);
      const keyedLocation = Object.assign({}, location, { key: locations.length })
      console.log('[DEBUG] on location', keyedLocation.key);
      locations.push(keyedLocation);
      this.setState({ locations, region });
    });

    BackgroundGeolocation.getConfig(
      function(config) {console.log('[DEBUG] getConfig', config);}
    );

    this.startTracking();
  }


  toggleTracking() {
    if (this.state.isTracking) {
      this.stopTracking();
    } else {
      this.startTracking();
    }
  }

  startTracking() {
    if (this.state.isTracking) { return; }

    BackgroundGeolocation.isLocationEnabled((enabled) => {
      if (enabled) {
        BackgroundGeolocation.start(
          () => {
            // service started successfully
            // you should adjust your app UI for example change switch element to indicate
            // that service is running
            console.log('[DEBUG] BackgroundGeolocation started successfully');
            this.setState({ isTracking: true });
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
            this.setState({ isTracking: false });
          }
        );
      } else {
        // Location services are disabled
        BackgroundGeolocation.showLocationSettings();
      }
    });
  }

  stopTracking() {
    if (!this.state.isTracking) { return; }

    BackgroundGeolocation.stop();
    this.setState({ isTracking: false });
  }

  render () {
    return null;
  }
}