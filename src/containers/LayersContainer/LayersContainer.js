import { connect } from "react-redux";

import LayerInput from "../../components/Layers";
import {
  createAddLayerAction,
  createRemoveLayerAction
} from "../../action-creators/map";

function mapDispatchToProps(dispatch) {
  return {
    addLayer: (id, data) => dispatch(createAddLayerAction(id, data)),
    removeLayer: id => dispatch(createRemoveLayerAction(id))
  };
}

const LayerInputContainer = connect(
  null,
  mapDispatchToProps
)(LayerInput);

export default LayerInputContainer;
