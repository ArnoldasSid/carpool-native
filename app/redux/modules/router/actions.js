import {
  ROUTE_REPLACE_REQUESTED,
  TAB_IND_UPDATED,
} from './constants';

export const replaceRoute = (newRoute) => {
  return {
    type: ROUTE_REPLACE_REQUESTED,
    payload: {
      route: newRoute,
    },
  };
};

export const changeTab = (newTabInd) => {
  return {
    type: TAB_IND_UPDATED,
    payload: {
      tabInd: newTabInd,
    },
  };
};