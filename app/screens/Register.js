import React from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import { MKTextField } from 'react-native-material-kit';
import { connect } from 'react-redux';
import { replaceRoute } from '../redux/modules/router/actions';

import { register } from '../redux/modules/auth/actions';
import authInfoSelector from '../redux/selectors/authInfo';
import registrationStatusSelector from '../redux/selectors/registrationStatus';
import RaisedButton from '../components/material/RaisedButton.js';
import FlatButton from '../components/material/FlatButton.js';

class Register extends React.Component {

  static propTypes = {
    authInfo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    registrationStatus: React.PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);

    this.register = this.register.bind(this);
    this.switchToLogin = this.switchToLogin.bind(this);

    this.state = {
      email: '',
      name: '',
      password: '',
      password2: '',
    }

  }

  switchToLogin () {
    this.props.dispatch(replaceRoute('login'));
  }

  register () {
    if (this.state.password !== this.state.password2) {
      return alert('Passwords don\'t match');
    }

    this.props.dispatch(register(this.state.email, this.state.password));
  }

  render () {
    const width = 226;
    return (
      <View
        style={{
          paddingTop: 50,
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {this.props.registrationStatus.error ? (
            <View>
              <Text style={{ color: 'red' }}>
                Error: {this.props.registrationStatus.error}
              </Text>
            </View>
          ) : null}
          <MKTextField
            style={{ width: width, height: 45 }}
            textInputStyle={{ flex: 1 }}
            floatingLabelEnabled={true}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            placeholder="Email"
          />
          <MKTextField
            style={{ width: width, height: 45, marginTop: 5 }}
            textInputStyle={{ flex: 1 }}
            floatingLabelEnabled={true}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            password
          />
          <MKTextField
            style={{ width: width, height: 45, marginTop: 5 }}
            textInputStyle={{ flex: 1 }}
            floatingLabelEnabled={true}
            value={this.state.password2}
            onChangeText={password2 => this.setState({ password2 })}
            placeholder="Password again"
            password
          />
          <RaisedButton
            colored
            style={{
              width,
              marginTop: 25,
            }}
            onPress={this.register}
            label="Register"
            loading={this.props.registrationStatus.inProgress}
          />
          <FlatButton
            colored
            style={{
              width,
              marginTop: 15,
            }}
            onPress={this.switchToLogin}
            label="Already have an account?"
          />
        </View>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
  registrationStatus: registrationStatusSelector(state),
}))(Register);
