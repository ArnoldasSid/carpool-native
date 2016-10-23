import React from 'react';
import PushNotification from 'react-native-push-notification';
import { AppState } from 'react-native';

export default class PushController extends React.Component {

  constructor (props) {
    super(props);

    this.handleAppStateChange = this.handleAppStateChange.bind(this);

  }

  componentDidMount () {
    PushNotification.configure({
      onNotification: (notification) => {
        console.log('NOTIFICATION:', notification);
      },
    });
    AppState.addEventListener('change', this.handleAppStateChange);

    setTimeout(() => {
      console.log(PushNotification);
      console.log(new Date(Date.now() + (3 * 1000) - (7 * 1000 * 60 * 60)));
      const dateToSchedule =
        PushNotification.localNotification({
          message: "Local message", // (required)
        })
    })
  }

  handleAppStateChange (state) {
    if (state === 'background') {
      console.log('Scheduling a notification');
      // PushNotification.scheduleLocalNotification({
      //   message: "My Notification Message", // (required)
      //   date: new Date(Date.now() + (3 * 1000)) // in 60 secs
      // });
      //
      // PushNotification.localNotificationSchedule({
      //   message: "My Notification Message 2", // (required)
      //   date: new Date(Date.now() + (3 * 1000)) // in 60 secs
      // })
    }
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  render () {
    return null;
  }
}