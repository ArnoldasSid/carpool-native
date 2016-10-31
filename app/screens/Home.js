import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import Button from 'react-native-button';

import authInfoSelector from '../redux/selectors/authInfo';
import Map from '../components/Map';

import { saveLocation, subscribeToUsersLocation, requestRide } from '../redux/api';

class Home extends React.Component {

  static propTypes = {
    authInfo: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.sendLocation = this.sendLocation.bind(this);
    this.requestRide = this.requestRide.bind(this);

    this.state = {
      latitude: 37.78825,
      longitude: -122.4324,
    }
  }

  componentDidMount () {
    const sub$ = subscribeToUsersLocation(this.props.authInfo.userId, 50);
    const loc$ = sub$.filter(val => val.msg === 'added').map(val => val.fields.loc)

    loc$.debounce(100).subscribe({
      next: (loc) => {
        this.setState({
          latitude: loc[1],
          longitude: loc[0],
        });
      }
    })
  }

  sendLocation () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  requestRide () {
    requestRide(this.props.authInfo.userId);
  }

  render () {
    return (
      <View>
        <Map
          width={360}
          height={360}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
        />
        <Button style={{ marginTop: 370 }} onPress={this.sendLocation}>
          Send Location
        </Button>
        <Button
          onPress={this.requestRide}
        >
          Request Ride
        </Button>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
}))(Home);