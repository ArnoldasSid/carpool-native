import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import Button from 'react-native-button';
import { logout } from '../redux/modules/auth/actions';
import { stopTracking } from '../redux/modules/locations/actions';
import { MKButton } from 'react-native-material-kit';

const RaisedButton = MKButton.coloredButton()
  .withStyle({ marginTop: 15 })
  .build();

const LogoutButton = MKButton.coloredButton()
  .withStyle({ marginTop: 15 })
  .build();

class Settings extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
  }

  logout () {
    this.props.dispatch(logout());
  }

  stopTracking () {
    this.props.dispatch(stopTracking());
  }

  render () {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <RaisedButton
          onPress={this.stopTracking}
          width={250}
        >
          <Text style={{ color: 'white' }}>
            Stop background tracking
          </Text>
        </RaisedButton>
        <LogoutButton
          onPress={this.logout}
          width={250}
        >
          <Text style={{ color: 'white' }}>
            Log Out
          </Text>
        </LogoutButton>
      </View>
    )
  }
}

export default connect(state => ({

}))(Settings);