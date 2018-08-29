import { combineReducers, createStore } from 'redux';

import allReducers from './reducers';

const reducer = combineReducers(allReducers);
const store = createStore(reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;