import { ADD_LAYER, REMOVE_LAYER } from '../action-types/map';

export const createAddLayerAction = (id, data) => {
  return {
    type: ADD_LAYER,
    payload: {
      id,
      data,
    },
  };
};

export const createRemoveLayerAction = (id) => {
  return {
    type: REMOVE_LAYER,
    payload: {
      id,
    },
  };
};