import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux';
import { getTheme } from 'react-native-material-kit';
import { markNotificationAsRead } from '../../redux/api';

import { acceptRideRequest } from '../../redux/modules/currentTrip/actions';
import authInfoSelector from '../../redux/selectors/authInfo';
import NotificationActionButton from './NotificationActionButton';

const theme = getTheme();

const styles = StyleSheet.create({
  notificationWrap: {
    margin: 10,
  },
  actionsWrap: {
    borderStyle: "solid",
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    borderTopWidth: 1,
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
      <View style={[styles.notificationWrap, theme.cardStyle]}>
        <Text style={{
          backgroundColor: "transparent",
          color: "#000000",
          fontSize: 24,
          left: 10,
          padding: 16,
          paddingBottom: 0,
        }}>Ride request received</Text>
        <Text style={theme.cardContentStyle}>
          {this.props.requesterName} is requesting a ride
        </Text>
        <View style={styles.actionsWrap}>
          <NotificationActionButton onPress={this.acceptRideRequest}>
            <Text style={{ color: '#3f51b5' }}>
              Accept
            </Text>
          </NotificationActionButton>
          <NotificationActionButton onPress={this.declineRideRequest}>
            <Text style={{ color: '#3f51b5' }}>
              Decline
            </Text>
          </NotificationActionButton>
        </View>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
}))(RideRequestNotification);