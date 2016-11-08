import React from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import { MKTextField, MKButton } from 'react-native-material-kit';
import { login } from '../redux/modules/auth/actions';
import { connect } from 'react-redux';
import authInfoSelector from '../redux/selectors/authInfo';
import loginStatusSelector from '../redux/selectors/loginStatus';
import { replaceRoute } from '../redux/modules/router/actions';

const RaisedButton = MKButton.coloredButton()
  .withStyle({ marginTop: 20 })
  .build();

const RegisterButton = MKButton.coloredButton()
  .withStyle({ marginTop: 10 })
  .build();

class Login extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    authInfo: React.PropTypes.object.isRequired,
    loginStatus: React.PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);

    this.login = this.login.bind(this);
    this.switchToRegister = this.switchToRegister.bind(this);

    this.state = {
      email: '',
      password: '',
    }
  }

  login () {
    this.props.dispatch(login(this.state.email, this.state.password));
  }

  switchToRegister () {
    this.props.dispatch(replaceRoute('register'));
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
          {this.props.loginStatus.error ? (
            <View>
              <Text style={{ color: 'red' }}>
                Error: {this.props.loginStatus.error}
              </Text>
            </View>
          ) : null}
          <MKTextField
            style={{ width: width }}
            floatingLabelEnabled={true}
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            placeholder="Email"
          />
          <MKTextField
            style={{ width: width }}
            floatingLabelEnabled={true}
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            placeholder="Password"
            password
          />
          <RaisedButton
            onPress={this.login}
            width={width}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Login
            </Text>
          </RaisedButton>
          <RegisterButton
            onPress={this.switchToRegister}
            width={width}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Create Account
            </Text>
          </RegisterButton>
        </View>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
  loginStatus: loginStatusSelector(state),
}))(Login);