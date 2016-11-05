import {
  ROUTE_REPLACE_REQUESTED,
} from './constants';

export const replaceRoute = (newRoute) => {
  return {
    type: ROUTE_REPLACE_REQUESTED,
    payload: {
      route: newRoute,
    },
  };
};