import { useMemo } from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer, StoreState } from './reducers'


export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware()))





