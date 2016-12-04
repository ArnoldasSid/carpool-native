import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import MapScreen from './Map';
import NotificationsScreen from './Notifications';
import SettingsScreen from './Settings';
import activeTabIndexSelector from '../redux/selectors/activeTabIndex';
import { changeTab } from '../redux/modules/router/actions';

class Home extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    activeTabIndex: React.PropTypes.number.isRequired,
  };

  constructor (props) {
    super(props);

    this.tabChanged = this.tabChanged.bind(this);

    this.state = {
      page: 0,
    };
  }

  tabChanged (tabChangeInfo) {
    this.props.dispatch(changeTab(tabChangeInfo.i));
  }

  render () {
    return (
      <ScrollableTabView
        page={this.props.activeTabIndex}
        onChangeTab={this.tabChanged}
        tabBarTextStyle={{
          fontFamily: 'roboto',
          lineHeight: 30,
        }}
      >
        <MapScreen tabLabel="Trip" />
        <NotificationsScreen tabLabel="Notifications" />
        <SettingsScreen tabLabel="Settings" />
      </ScrollableTabView>
    )
  }
}

export default connect(state => ({
  activeTabIndex: activeTabIndexSelector(state),
}))(Home);