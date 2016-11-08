import {
  STOP_BACKGROUND_TRACKING,
} from './constants';

export const stopTracking = () => {
  return {
    type: STOP_BACKGROUND_TRACKING,
  };
};