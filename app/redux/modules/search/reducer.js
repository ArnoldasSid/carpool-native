import {
  SET_SEARCH_PARAMS,
} from './constants';

const initialState = {
  fromAddress: null,
  toAddress: null,
};

export default function searchReducer (state = initialState, action) {
  if (action.type === SET_SEARCH_PARAMS) {
    return {
      ...state,
      ...action.payload,
    };
  }

  return state;
}
