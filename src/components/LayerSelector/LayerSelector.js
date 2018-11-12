import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

class LayerSelector extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect({ value }) {
    this.props.onSelect(value);
  }

  render() {
    const { layers, className } = this.props;
    const layerInput = this.props.value;
    const selectableLayers = layers.map(layer => ({
      value: layer.id,
      label: layer.displayName
    }));

    const selectedLayer = layerInput ? selectableLayers.filter(l => l.value === layerInput.layerId) : null

    return (
      <Select
        className={className}
        value={selectedLayer}
        onChange={this.handleSelect}
        options={selectableLayers}
      />
    );
  }
}

LayerSelector.propTypes = {
  onSelect: PropTypes.func
};

export default LayerSelector;
