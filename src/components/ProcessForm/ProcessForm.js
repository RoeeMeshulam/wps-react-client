import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Input from "./Input";
import { InputTypes } from "./ProcessFormUtils";

import LayerInput from "../LayerInput";
// import LayerInput from '../../containers/LayerInputContainer'; todo remove LayerInputContainer

import "./ProcessForm.css";

class ProcessForm extends React.Component {
  constructor(props) {
    super(props);

    this.inputValues = [];
    this.handleAddComplexData = this.handleAddComplexData.bind(this);
    this.handleAddLiteralData = this.handleAddLiteralData.bind(this);
    this.inputGenerator = new window.InputGenerator();
  }

  handleAddComplexData(layerId, i) {
    const values = layerId !== undefined ? [layerId] : [];

    const identifier = this.props.inputs[i].id;
    let inputs = this.props.inputs.map(
      input =>
        input.id === identifier
          ? Object.assign(new Input(), input, { values: [layerId] })
          : input
    );

    this.props.onChange(inputs);
  }

  handleAddLiteralData(event) {
    const i = parseInt(event.currentTarget.id.replace("form-input-", ""));
    const identifier = this.props.inputs[i].id;
    const value = event.target.value;

    const values = value ? [value] : [];
    let inputs = this.props.inputs.map(
      input =>
        input.id === identifier
          ? Object.assign(new Input(), input, { values })
          : input
    );

    this.props.onChange(inputs);
  }

  render() {
    const { inputs, handleOnSubmit } = this.props;
    return (
      <form>
        {inputs.map((formInput, i) => (
          <div>
            <h3>{formInput.title}</h3>
            <p>{formInput.abstractValue}</p>
            {formInput.type === InputTypes.COMPLEX ? (
              <LayerInput
                layers={this.props.layers}
                key={i}
                id={i}
                onSelect={this.handleAddComplexData}
              />
            ) : (
              <input
                key={formInput.identifier}
                onChange={this.handleAddLiteralData}
                value={formInput.values[0]}
                id={`form-input-${i}`}
                type="text"
              />
            )}
          </div>
        ))}
        <button type="button" onClick={this.props.onSubmit}>
          Execute
        </button>
      </form>
    );
  }
}

ProcessForm.propTypes = {
  inputs: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ProcessForm;
