// @flow
import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import snackbarSelector from '../redux/selectors/snackbar';

class Snackbar extends React.Component {
  static propTypes = {
    screenWidth: React.PropTypes.number.isRequired,
    snackbar: React.PropTypes.object.isRequired,
  };

  state: {
    snackbarVisible: boolean,
    bottom: any,
  };
  constructor(props) {
    super(props);

    this.state = {
      snackbarVisible: false,
      bottom: -48,
    };
  }

  showSnackbar() {
    this.setState({
      snackbarVisible: true,
      bottom: spring(0),
    });
  }

  hideSnackbar() {
    this.setState({
      snackbarVisible: false,
      bottom: spring(-48),
    });
  }

  componentWillReceiveProps(nextProps) {
    this.showSnackbar();

    setTimeout(() => this.hideSnackbar(), nextProps.snackbar.duration);
  }

  render() {
    console.log('Snackbar');
    return (
      <Motion
        defaultStyle={{ bottom: -48 }}
        style={{ bottom: this.state.bottom }}
        children={({ bottom }) => (
          <View
            style={{
              position: 'absolute',
              bottom,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: this.props.screenWidth,
              height: 48,
              backgroundColor: '#333',
            }}
          >
            <Text
              style={{
                marginLeft: 24,
                color: 'white',
              }}
            >
              {this.props.snackbar.text || "Empty snackbar - if you see this it's a bug"}
            </Text>
          </View>
        )}
      />
    );
  }
}

/* <SnackbarButton
  style={{
    marginLeft: 14,
    marginRight: 14,
    padding: 10,
  }}
>
  <Text
    style={{
      fontWeight: 'bold',
      color: '#ff4081',
    }}
  >
    Action!
  </Text>
</SnackbarButton> */

export default connect(state => ({
  snackbar: snackbarSelector(state),
}))(Snackbar);
