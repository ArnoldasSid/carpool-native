import React from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Button from 'react-native-button';
import { logout } from '../redux/modules/auth/actions';

class Settings extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout () {
    this.props.dispatch(logout());
  }

  render () {
    return (
      <View>
        <Button onPress={this.logout}>
          Log Out
        </Button>
      </View>
    )
  }
}

export default connect(state => ({

}))(Settings);