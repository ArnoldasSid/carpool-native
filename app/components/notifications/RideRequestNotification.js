import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux';
import { markNotificationAsRead } from '../../redux/api';

import { acceptRideRequest } from '../../redux/modules/currentTrip/actions';
import authInfoSelector from '../../redux/selectors/authInfo';

const styles = StyleSheet.create({
  notificationWrap: {
    padding: 10,
    margin: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
  },
  actionsWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});


class RideRequestNotification extends React.Component {

  static propTypes = {
    authInfo: React.PropTypes.object.isRequired,
    requesterName: React.PropTypes.string.isRequired,
    requesterId: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.acceptRideRequest = this.acceptRideRequest.bind(this);
    this.declineRideRequest = this.declineRideRequest.bind(this);
  }

  acceptRideRequest () {
    this.props.dispatch(acceptRideRequest({ userId: this.props.authInfo.userId, userEmail: this.props.authInfo.userEmail }, this.props.requesterId));
  }

  declineRideRequest () {
    markNotificationAsRead(this.props.id);
  }

  render () {
    return (
      <View style={styles.notificationWrap}>
        <Text>Ride request notification from
          <Text style={{ fontWeight: 'bold' }}>{' ' + this.props.requesterName}</Text>
        </Text>
        <View style={styles.actionsWrap}>
          <Button onPress={this.acceptRideRequest}>Accept</Button>
          <Button onPress={this.declineRideRequest}>Decline</Button>
        </View>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
}))(RideRequestNotification);