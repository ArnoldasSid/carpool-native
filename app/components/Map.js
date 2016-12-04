import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView from 'react-native-maps';
import moment from 'moment';

import DriverIcon from '../icons/car.png';
import DriverIcon1 from '../icons/car_1.png';
import RiderIcon from '../icons/walk.png';
import RiderIcon1 from '../icons/walk_1.png';
import RideRequesterIcon from '../icons/account-alert.png';
import RideRequesterIcon1 from '../icons/account-alert_1.png';
import MyLocationIcon from '../icons/target.png';
import MyLocationIcon1 from '../icons/target_1.png';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default class Map extends React.Component {

  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    markers: React.PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props);

    this.getMarkerColor = this.getMarkerColor.bind(this);

    this.state = {
      currTime: new Date().valueOf(),
    }
  }

  componentDidMount () {
    const timeUpdateInterval = setInterval(() => {
      this.setState({
        currTime: new Date().valueOf(),
      });
    }, 5000);
    this.setState({
      timeUpdateInterval,
    });
  }

  componentWillUnmount () {
    clearTimeout(this.state.timeUpdateInterval);
  }

  getMarkerColor (marker) {
    const tDiff = this.state.currTime - marker.timestamp;
    if (marker.isYourPosition) {
      if (tDiff > 60000) {
        return 'lightblue';
      }
      return 'blue';
    } else {
      if (tDiff > 60000) {
        return 'orange';
      }
      return 'red';
    }
  }

  getMarkerIcon (marker) {
    const greyTime = 2 * 60 * 1000;
    const isIconGrey = moment().valueOf() - marker.timestamp > greyTime;

    if (marker.isYourPosition) {
      return isIconGrey ? MyLocationIcon1 : MyLocationIcon;
    } else if (marker.isDriverPosition) {
      return isIconGrey ? DriverIcon1 : DriverIcon;
    } else if (marker.isRiderPosition) {
      return isIconGrey ? RiderIcon1 : RiderIcon;
    } else {
      return isIconGrey ? RideRequesterIcon1 : RideRequesterIcon;
    }
  }

  render () {
    // console.log(this.props.markers);
    return (
      <View style={[styles.container, { width: this.props.width, height: this.props.height }]}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 54.6872,
            longitude: 25.2797,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {this.props.markers.map((marker, i) => (
            <MapView.Marker
              key={i}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              image={this.getMarkerIcon(marker)}
              centerOffset={{x: 0, y: 24}}
              anchor={{x: 0.5, y: 0.5}}
            >
            </MapView.Marker>
          ))}
        </MapView>
      </View>
    );
  }
}
