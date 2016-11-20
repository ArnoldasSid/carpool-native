import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import Map from '../components/Map';
import { connect } from 'react-redux';
import authInfoSelector from '../redux/selectors/authInfo';
import { requestRide, tripCompleted } from '../redux/modules/currentTrip/actions';
import locationsSelector from '../redux/selectors/locations';
import currentTripSelector from '../redux/selectors/currentTrip.js';
import RaisedButton from '../components/material/RaisedButton.js';

class MapScreen extends React.Component {

  static propTypes = {
    authInfo: React.PropTypes.object.isRequired,
    currentTrip: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    locations: React.PropTypes.object.isRequired,
  };

  renderButton () {
    function buttonPressed () {
      const requesting = this.props.currentTrip.status === 'requestingRide'
      const inTrip = this.props.currentTrip.status === 'driver' || this.props.currentTrip.status === 'rider'
      if (requesting) {
        alert('Withdrawing ride requests not implemented');
        return;
      } else if (inTrip) {
        this.props.dispatch(tripCompleted());
      } else {
        this.props.dispatch(requestRide(this.props.authInfo.userEmail, this.props.authInfo.userId));
      }
    }
    const requesting = this.props.currentTrip.status === 'requestingRide'
    const inTrip = this.props.currentTrip.status === 'driver' || this.props.currentTrip.status === 'rider'

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
    )
  }

  render () {
    const { locations } = this.props;
    const markers = [];
    const locKeys = Object.keys(locations);
    locKeys.forEach(key => {
      let marker = locations[key];
      if (key === this.props.authInfo.userId) {
        marker = Object.assign({}, marker, { isYourPosition: true });
      } else if(key === this.props.currentTrip.driver.userId) {
        marker = Object.assign({}, marker, { isDriverPosition: true });
      } else {
        const riderIds = this.props.currentTrip.riders.map(rider => rider.userId);
        if (riderIds.indexOf(key) !== -1) {
          marker = Object.assign({}, marker, { isRiderPosition: true });
        }
      }
      if (this.props.currentTrip.status === 'rider' && !marker.isYourPosition && !marker.isDriverPosition) {
        return
      }
      markers.push(marker);
    });

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
  locations: locationsSelector(state),
  currentTrip: currentTripSelector(state),
}))(MapScreen);
