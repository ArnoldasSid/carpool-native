import React from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import { MKTextField, MKButton } from 'react-native-material-kit';
import { connect } from 'react-redux';
import { replaceRoute } from '../redux/modules/router/actions';

import { register } from '../redux/modules/auth/actions';
import authInfoSelector from '../redux/selectors/authInfo';
import registrationStatusSelector from '../redux/selectors/registrationStatus';

const RegisterButton = MKButton.coloredButton()
  .withStyle({ marginTop: 20 })
  .build();

const GoToLoginButton = MKButton.coloredButton()
  .withStyle({ marginTop: 10 })
  .build();

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
            style={{ width: width }}
            floatingLabelEnabled={true}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            placeholder="Email"
          />
          <MKTextField
            style={{ width: width }}
            floatingLabelEnabled={true}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            password
          />
          <MKTextField
            style={{ width: width }}
            floatingLabelEnabled={true}
            value={this.state.password2}
            onChangeText={password2 => this.setState({ password2 })}
            placeholder="Password again"
            password
          />
          <RegisterButton
            onPress={this.register}
            width={width}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Register
            </Text>
          </RegisterButton>
          <GoToLoginButton
            width={width}
            onPress={this.switchToLogin}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Already have an account?
            </Text>
          </GoToLoginButton>
        </View>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
  registrationStatus: registrationStatusSelector(state),
}))(Register);