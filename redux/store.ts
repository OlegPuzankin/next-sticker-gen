import { useMemo } from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer, StoreState } from './reducers'

let store


function initStore(preloadedState: StoreState) {

  return createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  )
}

export const STORE = createStore(rootReducer, composeWithDevTools(applyMiddleware()))

function parsePreloadState(preloadedState: StoreState) {

  if (preloadedState && typeof preloadedState.stickers.stickers === 'string') {
    const array = JSON.parse(preloadedState.stickers.stickers)
    preloadedState.stickers.stickers = array

  }


}



export const initializeStore = (preloadedState: StoreState) => {
  parsePreloadState(preloadedState)
  let _store = store ?? initStore(preloadedState)

  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    store = undefined
  }

  if (typeof window === 'undefined') return _store
  if (!store) store = _store

  return _store
}

export function useStore(initialState: StoreState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
