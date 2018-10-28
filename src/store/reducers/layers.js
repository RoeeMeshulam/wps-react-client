import Immutable from 'immutable';

import { ADD_LAYER, REMOVE_LAYER } from '../../action-types/map';

const initialState = Immutable.List();

export default function (state = initialState, action) {
  let newState = state;
  switch (action.type) {
    case ADD_LAYER:
      newState = state.push(action.payload);
      break;
    case REMOVE_LAYER:
      newState = state.filter(layer => action.payload.id !== layer.id )
      break;
    default:
      newState = state;
      break;
  }
  return newState;
}