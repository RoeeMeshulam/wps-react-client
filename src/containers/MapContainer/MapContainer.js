import { connect } from 'react-redux';

import Map from '../../components/Map';
import { createAddLayerAction } from '../../action-creators/map';

function mapStateToProps (state) {
  return {
    layers: state.layers.valueSeq().toJS()
  }
}

function mapDispatchToProps (dispatch) {
  return {
    removeLayer: (name) => dispatch(createAddLayerAction(name)),
  };
}

const MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;