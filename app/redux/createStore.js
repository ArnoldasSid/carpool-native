import { createStore, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import mostAdapter from 'redux-observable-adapter-most'
import { composeWithDevTools } from 'remote-redux-devtools'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './rootReducer.js'
import rootSaga from './rootSaga.js'

import authEpic from './modules/auth/epic'

import { APP_INIT } from './modules/app/constants.js'

export function createAppStore () {

  const rootEpic = combineEpics(
    authEpic,
  )

  const sagaMiddleware = createSagaMiddleware()


  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(
      sagaMiddleware,
      createEpicMiddleware(rootEpic, { adapter: mostAdapter })
    ))
  )

  sagaMiddleware.run(rootSaga)

  store.dispatch({
    type: APP_INIT,
  })

  return store
}

const store = createAppStore()
export default store
