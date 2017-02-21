// @flow
import React from 'react';
import { ScrollView, View, Text, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { format } from 'date-fns';

import devLogMessagesSelector from '../redux/selectors/devLogMessages.js';

type Props = {
  devLogMessages: Object[],
};

class DevLog extends React.Component {
  props: Props;
  state: {
    showDdp: boolean,
    showGeolocation: boolean,
    showNotification: boolean,
    showTripUpdate: boolean,
  };
  state = {
    showDdp: true,
    showGeolocation: true,
    showNotification: true,
    showTripUpdate: true,
  };

  shouldMessageBeShown: Function;
  constructor(props: Props) {
    super(props);

    this.shouldMessageBeShown = this.shoudMessageBeShown.bind(this);
  }

  shoudMessageBeShown(message) {
    switch (message.type) {
      case 'DDP':
        return this.state.showDdp;
      case 'GEOLOCATION':
        return this.state.showGeolocation;
      case 'NOTIFICATION':
        return this.state.showNotification;
      case 'TRIP_UPDATE':
        return this.state.showTripUpdate;
      default:
        return true;
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {this.props.devLogMessages.map(
            (message, i) => this.shouldMessageBeShown(message)
              ? <View
                  key={i}
                  style={{
                    borderBottomWidth: 1,
                    borderStyle: 'solid',
                    borderBottomColor: '#333',
                    padding: 6,
                  }}
                >
                  {message.title ? <Text style={{ fontWeight: 'bold' }}>{message.title}</Text> : null}
                  <Text>{format(new Date(message.timestamp), 'MM-DD HH:mm:ss')}</Text>
                  {message.message ? <Text>{message.message}</Text> : null}
                </View>
              : null,
          )}
        </ScrollView>
        <View style={{ flex: 1, maxHeight: 40, flexDirection: 'row', justifyContent: 'space-around' }}>
          <Button
            color={this.state.showDdp ? 'rgb(63, 81, 181)' : '#888'}
            title="DDP"
            onPress={() => this.setState({ showDdp: !this.state.showDdp })}
          />

          <Button
            title="Geolocation"
            onPress={() => this.setState({ showGeolocation: !this.state.showGeolocation })}
            color={this.state.showGeolocation ? 'rgb(63, 81, 181)' : '#888'}
          />
          <Button
            title="Notification"
            onPress={() => this.setState({ showNotification: !this.state.showNotification })}
            color={this.state.showNotification ? 'rgb(63, 81, 181)' : '#888'}
          />
          <Button
            title="Trip Update"
            onPress={() => this.setState({ showTripUpdate: !this.state.showTripUpdate })}
            color={this.state.showTripUpdate ? 'rgb(63, 81, 181)' : '#888'}
          />
        </View>
      </View>
    );
  }
}

export default connect(state => ({
  devLogMessages: devLogMessagesSelector(state),
}))(DevLog);
