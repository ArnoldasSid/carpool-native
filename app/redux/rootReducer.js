import { combineReducers } from 'redux'

import auth from './modules/auth/reducer'
import notifications from './modules/notifications/reducer'
import router from './modules/router/reducer'
import trip from './modules/trip/reducer'
import snackbar from './modules/snackbar/reducer'
import devLog from './modules/devLog/reducer.js'

export default combineReducers({
  auth,
  notifications,
  router,
  trip,
  snackbar,
  devLog,
})
