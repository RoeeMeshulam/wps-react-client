import * as React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

import "./LayerInput.css";

class LayerInput extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);

    this.state = {
      urlValue: ""
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect({ value }) {
    this.props.onSelect(value, this.props.id);
  }

  render() {
    return (
      <Select
        onChange={this.handleSelect}
        options={this.props.layers.map(layer => ({
          value: layer.id,
          label: layer.displayName
        }))}
      />
    );
  }
}

LayerInput.propTypes = {
  onSelect: PropTypes.func
};

export default LayerInput;
