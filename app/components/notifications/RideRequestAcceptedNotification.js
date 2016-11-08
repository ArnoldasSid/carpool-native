import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { getTheme } from 'react-native-material-kit';
import { connect } from 'react-redux';

import { markNotificationAsRead } from '../../redux/api';
import NotificationActionButton from './NotificationActionButton';
import { acceptRideRequest } from '../../redux/modules/notifications/actions';

const theme = getTheme();

const styles = StyleSheet.create({
  notificationWrap: {
    padding: 10,
    margin: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
  },
  actionsWrap: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});


class RideRequestAcceptedNotification extends React.Component {

  static propTypes = {
    requesterName: React.PropTypes.string.isRequired,
    requesterId: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.markAsRead = this.markAsRead.bind(this);
  }

  markAsRead () {
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
        }}>Ride request accepted</Text>
        <Text style={theme.cardContentStyle}>
          {this.props.requesterName} has accepted your ride request
        </Text>
        <View style={styles.actionsWrap}>
          <NotificationActionButton onPress={this.markAsRead}>
            <Text style={{ color: '#3f51b5' }}>
              Ok
            </Text>
          </NotificationActionButton>
        </View>
      </View>
    );
  }
}

export default connect()(RideRequestAcceptedNotification);