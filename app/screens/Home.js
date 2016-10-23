import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import Button from 'react-native-button';

import authInfoSelector from '../redux/selectors/authInfo';
import Map from '../components/Map';

import { saveLocation, subscribeToUsersLocation } from '../redux/api';

class Home extends React.Component {

  static propTypes = {
    authInfo: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.sendLocation = this.sendLocation.bind(this);
  }

  componentWillMount () {
    subscribeToUsersLocation(this.props.authInfo.userId, 50);
  }

  sendLocation () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords);
        saveLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  render () {
    return (
      <View>
        {/*<Map />*/}
        <Button onPress={this.sendLocation}>
          Send Location
        </Button>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
}))(Home);