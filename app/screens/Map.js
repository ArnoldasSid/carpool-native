import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import Map from '../components/Map';
import { MKButton } from 'react-native-material-kit';
import { connect } from 'react-redux';
import authInfoSelector from '../redux/selectors/authInfo';
import { requestRide } from '../redux/modules/currentTrip/actions';
import locationsSelector from '../redux/selectors/locations';

const RequestRideButton = MKButton.coloredButton()
  .withStyle({ marginTop: 15 })
  .build();

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
      let marker = locations[key];
      if (key === this.props.authInfo.userId) {
        marker = Object.assign({}, marker, { isYourPosition: true });
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
        <RequestRideButton
          onPress={this.requestRide}
          width={300}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Request Ride
          </Text>
        </RequestRideButton>
      </View>
    );
  }
}


export default connect(state => ({
  authInfo: authInfoSelector(state),
  locations: locationsSelector(state),
}))(MapScreen);