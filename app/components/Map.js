// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import moment from 'moment';

import type { Location, User, UsersRole } from '../models.js';

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

type Props = {
  width: number,
  height: number,
  yourLocation: Location,
  otherUsers: User[],
};

export default class Map extends React.Component {
  props: Props;
  state: {
    currTime: number,
    timeUpdateInterval: ?number,
  };
  constructor(props: Props) {
    super(props);

    this.state = {
      currTime: new Date().valueOf(),
      timeUpdateInterval: null,
    };
  }

  componentDidMount() {
    const timeUpdateInterval = setInterval(
      () => {
        this.setState({
          currTime: new Date().valueOf(),
        });
      },
      10000,
    );
    this.setState({
      timeUpdateInterval,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeUpdateInterval);
  }

  getMarkerIcon(role: UsersRole | 'YOU', time: number) {
    const greyTime = 2 * 60 * 1000;
    const isIconGrey = moment().valueOf() - time > greyTime;

    if (role === 'YOU') {
      return isIconGrey ? MyLocationIcon1 : MyLocationIcon;
    } else if (role === 'DRIVER') {
      return isIconGrey ? DriverIcon1 : DriverIcon;
    } else if (role === 'RIDER') {
      return isIconGrey ? RiderIcon1 : RiderIcon;
    } else if (role === 'REQUESTER') {
      return isIconGrey ? RideRequesterIcon1 : RideRequesterIcon;
    }
  }

  render() {
    const { yourLocation, otherUsers } = this.props;
    console.log(yourLocation, otherUsers);

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
          {yourLocation
            ? <MapView.Marker
                coordinate={yourLocation}
                image={this.getMarkerIcon('YOU', yourLocation.time)}
                centerOffset={{ x: 0, y: 24 }}
                anchor={{ x: 0.5, y: 0.5 }}
              />
            : null}
          {otherUsers.map(
            (user, i) =>
              user.location
                ? <MapView.Marker
                    key={i}
                    coordinate={user.location}
                    image={this.getMarkerIcon(user.role, user.location.time)}
                    centerOffset={{ x: 0, y: 24 }}
                    anchor={{ x: 0.5, y: 0.5 }}
                  />
                : null,
          )}
        </MapView>
      </View>
    );
  }
}
