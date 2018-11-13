import { connect } from "react-redux";
import { withAlert } from "react-alert";

import Layers from "../../components/Layers";
import {
  createAddLayerAction,
  createRemoveLayerAction
} from "../../action-creators/map";

function mapDispatchToProps(dispatch) {
  return {
    addLayerToMap: (id, layerType, data) =>
      dispatch(createAddLayerAction(id, layerType, data)),
    removeLayerFromMap: id => dispatch(createRemoveLayerAction(id))
  };
}

const LayersReduxContainer = connect(
  null,
  mapDispatchToProps
)(Layers);

const LayersReduxAlertContainer = withAlert(LayersReduxContainer);

export default LayersReduxAlertContainer;
