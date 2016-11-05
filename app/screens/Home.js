import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import MapScreen from './Map';
import NotificationsScreen from './Notifications';
import SettingsScreen from './Settings';
import ScrollableTabView from 'react-native-scrollable-tab-view';

export default class Home extends React.Component {

  constructor (props) {
    super(props);

    this.tabChanged = this.tabChanged.bind(this);

    this.state = {
      page: 1,
    };
  }

  tabChanged (tabChangeInfo) {
    this.setState({
      page: tabChangeInfo.i,
    });
  }

  render () {
    return (
      <ScrollableTabView initialPage={1} page={this.state.page} onChangeTab={this.tabChanged}>
        <MapScreen tabLabel="Map" />
        <NotificationsScreen tabLabel="Notifications" />
        <SettingsScreen tabLabel="Settings" />
      </ScrollableTabView>
    )
  }
}
