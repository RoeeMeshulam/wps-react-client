import { ADD_LAYER, REMOVE_LAYER } from '../action-types/map';

export const createAddLayerAction = (name, data) => {
  return {
    type: ADD_LAYER,
    payload: {
      name,
      data,
    },
  };
};

export const createRemoveLayerAction = (name) => {
  return {
    type: REMOVE_LAYER,
    payload: {
      name,
    },
  };
};