import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { MKButton } from 'react-native-material-kit';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import snackbarSelector from '../redux/selectors/snackbar'

const SnackbarButton =
  MKButton
    .coloredFlatButton()
    .build();

class Snackbar extends React.Component {

  static propTypes = {
    screenWidth: React.PropTypes.number.isRequired,
    snackbar: React.PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      snackbarVisible: false,
      marginTop: 0,
    };
  }

  showSnackbar () {
    this.setState({
      snackbarVisible: true,
      marginTop: spring(-48),
    });
  }

  hideSnackbar () {
    this.setState({
      snackbarVisible: false,
      marginTop: spring(0),
    })
  }

  componentWillReceiveProps (nextProps) {
    this.showSnackbar();

    setTimeout(() => this.hideSnackbar(), nextProps.snackbar.duration);
  }

  render () {
    return (
      <Motion
        defaultStyle={{ marginTop: 0 }}
        style={{ marginTop: this.state.marginTop }}
      >
        {({ marginTop }) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: this.props.screenWidth,
              marginTop: marginTop,
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
              {this.props.snackbar.text || 'No text'}
            </Text>
            {/*
             <SnackbarButton
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
             </SnackbarButton>
             */}
          </View>
        )}
      </Motion>
    );
  }
}

export default connect(state => ({
  snackbar: snackbarSelector(state),
}))(Snackbar)