import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import Map from '../components/Map';
import { connect } from 'react-redux';
import { requestRide, tripCompleted, withdrawRideRequest } from '../redux/modules/trip/actions';
import RaisedButton from '../components/material/RaisedButton.js';
import authInfoSelector from '../redux/selectors/authInfo';
import usersLocationSelector from '../redux/selectors/usersLocation';
import driverSelector from '../redux/selectors/driver';
import ridersSelector from '../redux/selectors/riders';
import requestersSelector from '../redux/selectors/requesters';
import userTripStatusSelector from '../redux/selectors/usersTripRole';

class MapScreen extends React.Component {

  static propTypes = {
    authInfo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    usersLocation: React.PropTypes.object,
    driver: React.PropTypes.object,
    riders: React.PropTypes.object.isRequired,
    requesters: React.PropTypes.object.isRequired,
    userTripStatus: React.PropTypes.string.isRequired,
  };

  renderButton () {
    function buttonPressed () {
      const requesting = this.props.userTripStatus === 'REQUESTER';
      const inTrip = this.props.userTripStatus === 'DRIVER' || this.props.userTripStatus === 'RIDER'
      if (requesting) {
        this.props.dispatch(withdrawRideRequest());
      } else if (inTrip) {
        this.props.dispatch(tripCompleted());
      } else {
        this.props.dispatch(requestRide(this.props.authInfo.userEmail, this.props.authInfo.userId));
      }
    }
    const requesting = this.props.userTripStatus === 'REQUESTER';
    const inTrip = this.props.userTripStatus === 'DRIVER' || this.props.userTripStatus === 'RIDER'
    let buttonLabel;
    if (requesting) {
      buttonLabel = 'Withdraw Request';
    } else if (inTrip) {
      buttonLabel = 'Trip Completed';
    } else {
      buttonLabel = 'Request Ride';
    }
    return (
      <RaisedButton
        colored
        onPress={buttonPressed.bind(this)}
        style={{
          width: 300,
          marginTop: 15,
        }}
        label={buttonLabel}
      />
    );
  }

  render () {
    const { usersLocation, driver, riders, requesters } = this.props;
    const markers = [];

    // console.log('ASDASD', usersLocation);
    if (usersLocation) {
      markers.push({
        ...usersLocation,
        isYourPosition: true,
      })
    }

    if (driver) {
      markers.push({
        ...driver.location,
        isDriverPosition: true,
      })
    }

    const riderIds = Object.keys(riders);
    riderIds.forEach(riderId => {
      const rider = requesters[riderId];
      if (rider) {
        markers.push({
          ...rider.location,
          isRiderPosition: true,
        });
      }
    });

    Object.keys(requesters)
      .filter(requesterId => riderIds.indexOf(requesterId) === -1)
      .filter(requesterId => !driver || driver.id !== requesterId)
      .forEach(requesterId => {
        const requester = requesters[requesterId];
        markers.push({
          ...requester.location,
        });
      });


    // const locKeys = Object.keys(locations);
    // locKeys.forEach(key => {
    //   let marker = locations[key];
    //   if (key === this.props.authInfo.userId) {
    //     marker = Object.assign({}, marker, { isYourPosition: true });
    //   } else if(key === this.props.currentTrip.driver.userId) {
    //     marker = Object.assign({}, marker, { isDriverPosition: true });
    //   } else {
    //     const riderIds = this.props.currentTrip.riders.map(rider => rider.userId);
    //     if (riderIds.indexOf(key) !== -1) {
    //       marker = Object.assign({}, marker, { isRiderPosition: true });
    //     }
    //   }
    //   if (this.props.currentTrip.status === 'rider' && !marker.isYourPosition && !marker.isDriverPosition) {
    //     return
    //   }
    //   markers.push(marker);
    // });

    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Map
          width={360}
          height={360}
          markers={markers}
        />
        <View style={{width: 360, height: 360}}></View>
        {this.renderButton()}
      </View>
    );
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
  usersLocation: usersLocationSelector(state),
  driver: driverSelector(state),
  riders: ridersSelector(state),
  requesters: requestersSelector(state),
  userTripStatus: userTripStatusSelector(state),
}))(MapScreen);
