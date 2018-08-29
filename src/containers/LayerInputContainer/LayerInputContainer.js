import { connect } from 'react-redux';

import LayerInput from '../../components/LayerInput';
import { createAddLayerAction } from '../../action-creators/map';

function mapDispatchToProps (dispatch) {
  return {
    addLayer: (name, data) => dispatch(createAddLayerAction(name, data)),
  };
}

const LayerInputContainer = connect(null, mapDispatchToProps)(LayerInput);

export default LayerInputContainer;