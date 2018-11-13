import { ADD_LAYER, REMOVE_LAYER } from "../action-types/map";

export const createAddLayerAction = (id, layerType, data) => {
  return {
    type: ADD_LAYER,
    payload: {
      layerType,
      id,
      data
    }
  };
};

export const createRemoveLayerAction = id => {
  return {
    type: REMOVE_LAYER,

    payload: {
      id
    }
  };
};
