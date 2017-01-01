// @flow
import React from 'react'
import { connect } from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import MapScreen from './Map'
import NotificationsScreen from './Notifications'
import SettingsScreen from './Settings'
import DevLogScreen from './DevLog.js'
import activeTabIndexSelector from '../redux/selectors/activeTabIndex'
import authInfoSelector from '../redux/selectors/authInfo.js'
import { changeTab } from '../redux/modules/router/actions'

type Props = {
  dispatch: Function,
  activeTabIndex: number,
  authInfo: Object,
}

class Home extends React.Component {

  props: Props
  state: {
    page: number,
  }
  tabChanged: Function

  constructor (props: Props) {
    super(props)

    this.tabChanged = this.tabChanged.bind(this)

    this.state = {
      page: 0,
    }
  }

  tabChanged (tabChangeInfo) {
    this.props.dispatch(changeTab(tabChangeInfo.i))
  }

  render () {
    return (
      <ScrollableTabView
        page={this.props.activeTabIndex}
        onChangeTab={this.tabChanged}
        tabBarTextStyle={{
          paddingTop: 22,
        }}
      >
        <MapScreen tabLabel="Trip" />
        <NotificationsScreen tabLabel="Notifications" />
        <SettingsScreen tabLabel="Settings" />
        <DevLogScreen tabLabel="Log" />
      </ScrollableTabView>
    )
  }
}

export default connect(state => ({
  activeTabIndex: activeTabIndexSelector(state),
  authInfo: authInfoSelector(state),
}))(Home)
