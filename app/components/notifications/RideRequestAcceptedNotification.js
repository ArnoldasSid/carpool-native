// @flow
import React from 'react';
import { connect } from 'react-redux';

import { markNotificationAsRead } from '../../redux/modules/notifications/actions';
import moment from 'moment';

import NotificationTitle from './NotificationTitle.js';
import NotificationTime from './NotificationTime.js';
import NotificationContent from './NotificationContent.js';
import NotificationActions from './NotificationActions.js';
import NotificationWrap from './NotificationWrap.js';

class RideRequestAcceptedNotification extends React.Component {
  static propTypes = {
    requesterName: React.PropTypes.string.isRequired,
    requesterId: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    timestamp: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    opacity: React.PropTypes.number.isRequired,
  };

  markAsRead: Function;
  constructor(props) {
    super(props);

    this.markAsRead = this.markAsRead.bind(this);
  }

  markAsRead() {
    this.props.dispatch(markNotificationAsRead(this.props.id));
  }

  getTimeDiff(notificationTimestamp) {
    return moment().from(notificationTimestamp);
  }

  render() {
    return (
      <NotificationWrap height={115} heightAnim={this.props.height} opacity={this.props.opacity}>
        <NotificationTitle>
          Ride request accepted
        </NotificationTitle>
        <NotificationTime>
          ({this.getTimeDiff(this.props.timestamp)})
        </NotificationTime>
        <NotificationContent>
          {this.props.requesterName} has accepted your ride request
        </NotificationContent>
        <NotificationActions
          actions={[
            {
              onPress: this.markAsRead,
              text: 'Hide',
            },
          ]}
        />
      </NotificationWrap>
    );
  }
}

export default connect()(RideRequestAcceptedNotification);
