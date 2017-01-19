// @flow
import React from 'react'
import {
  ScrollView,
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import { format } from 'date-fns'

import devLogMessagesSelector from '../redux/selectors/devLogMessages.js'

type Props = {
  devLogMessages: Object[],
}

class DevLog extends React.Component {

  props : Props

  render () {
    console.log(this.props)
    return (
      <ScrollView>
        {this.props.devLogMessages.map((message, i) => (
          <View key={i}
            style={{ borderBottomWidth: 1,
              borderStyle: 'solid',
              borderBottomColor: '#333',
              padding: 6,
            }}
          >
            {message.title ? (
              <Text style={{ fontWeight: 'bold' }}>{message.title}</Text>
            ): null}
            <Text>{format(new Date(message.timestamp), 'MM-DD HH:mm:ss')}</Text>
            {message.message ? (
              <Text>{message.message}</Text>
            ): null}
          </View>
        ))}
      </ScrollView>
    )
  }
}

export default connect(state => ({
  devLogMessages: devLogMessagesSelector(state),
}))(DevLog)
