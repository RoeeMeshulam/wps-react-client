import * as React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

import "./LayerInput.css";
import { LayersIcon } from "../Icons/Icons";

class LayerInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect({ value }) {
    this.props.onSelect(value, this.props.id);
  }

  render() {
    const { layers, className } = this.props;
    const layerId = this.props.value;
    const selectableLayers = layers.map(layer => ({
      value: layer.id,
      label: layer.displayName
    }));
    return (
      // <div>
      //  <LayersIcon className="layer-icon" />
      <Select
        className={className}
        value={selectableLayers.filter(l => l.value === layerId)}
        onChange={this.handleSelect}
        options={selectableLayers}
      />
      // </div>
    );
  }
}

LayerInput.propTypes = {
  onSelect: PropTypes.func
};

export default LayerInput;
