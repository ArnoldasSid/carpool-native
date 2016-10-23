import {
  SET_SEARCH_PARAMS,
} from './constants';

export const setSearchParams = (fromAddress, toAddress) => {
  return {
    type: SET_SEARCH_PARAMS,
    payload: {
      fromAddress,
      toAddress,
    },
  };
};
