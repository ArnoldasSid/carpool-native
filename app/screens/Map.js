import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import Map from '../components/Map';
import Button from 'react-native-button';
import { connect } from 'react-redux';
import authInfoSelector from '../redux/selectors/authInfo';
import { requestRide } from '../redux/modules/currentTrip/actions';
import locationsSelector from '../redux/selectors/locations';

class MapScreen extends React.Component {

  static propTypes = {
    authInfo: React.PropTypes.object.isRequired,
    locations: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.requestRide = this.requestRide.bind(this);
  }

  requestRide () {
    this.props.dispatch(requestRide(this.props.authInfo.userEmail, this.props.authInfo.userId));
  }

  render () {
    const { locations } = this.props;
    const markers = [];
    const locKeys = Object.keys(locations);
    locKeys.forEach(key => {
      markers.push(locations[key]);
    });

    return (
      <View style={{flex: 1}}>
        <Map
          width={360}
          height={360}
          markers={markers}
        />
        <View style={{width: 360, height: 370}}></View>
        <Button
          onPress={this.requestRide}
        >
          Request Ride
        </Button>
      </View>
    );
  }
}


export default connect(state => ({
  authInfo: authInfoSelector(state),
  locations: locationsSelector(state),
}))(MapScreen);