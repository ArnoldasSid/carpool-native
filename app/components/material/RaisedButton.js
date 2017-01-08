import React from 'react'
import { View, Text } from 'react-native'
import { MKButton, MKSpinner } from 'react-native-material-kit'

import settings from './settings.js'

export default class RaisedButton extends React.Component {

  static propTypes = {
    label: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func.isRequired,
    accent: React.PropTypes.bool,
    colored: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    style: React.PropTypes.object,
  }

  constructor (props) {
    super(props)

    this.handlePress = this.handlePress.bind(this)
  }

  getButtonBackgroundColor () {
    if (this.props.disabled) {
      if (this.props.colored) {
        return '#9FA8DA'
      }
    } else if (this.props.accent) {
      return settings.accentColor
    } else if (this.props.colored) {
      return settings.mainColor
    } else {
      return 'white'
    }
  }

  handlePress (...args) {
    if (!this.props.disabled) {
      this.props.onPress(...args)
    }
  }

  render () {
    return (
      <MKButton
        onPress={this.handlePress}
        style={{
          borderRadius: 2,
          shadowRadius: 1,
          shadowOffset: { width: 0, height: 0.5 },
          shadowOpacity: 0.7,
          shadowColor: 'black',
          elevation: 4,
          width: 100,
          height: 36,
          backgroundColor: this.getButtonBackgroundColor(),
          ...(this.props.style || {}),
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {this.props.loading ? (
            <MKSpinner
              style={{
                width: 17,
                height: 17,
                marginRight: 5,
                marginLeft: -(17 + 5), // width + marginRight
              }}
              strokeColor="white"
              strokeWidth={3}
            />
          ) : null}
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: 14,
            }}
          >
            {this.props.label}
          </Text>
        </View>
      </MKButton>
    )
  }
}
