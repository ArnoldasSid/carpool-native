import {
  LOGIN_REQUESTED,
  REGISTRATION_REQUESTED,
  LOGOUT_REQUESTED,
} from './constants';

export const login = (email, password) => {
  return {
    type: LOGIN_REQUESTED,
    payload: {
      email,
      password,
    },
  };
};

export const register = (email, password) => {
  return {
    type: REGISTRATION_REQUESTED,
    payload: {
      email,
      password,
    }
  };
};

export const logout = () => {
  return {
    type: LOGOUT_REQUESTED,
  };
};