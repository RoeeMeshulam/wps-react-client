import React from "react";
import PropTypes from "prop-types";
import Input from "./Input";
import { InputTypes } from "./ProcessFormUtils";

import LayerInput from "../LayerInput";

import "./ProcessForm.css";
import { TextIcon, LayersIcon } from "../Icons/Icons";

class ProcessForm extends React.Component {
  constructor(props) {
    super(props);

    this.inputValues = [];
    this.handleAddComplexData = this.handleAddComplexData.bind(this);
    this.handleAddLiteralData = this.handleAddLiteralData.bind(this);
    this.inputGenerator = new window.InputGenerator();
  }

  handleAddComplexData(layerId, i) {
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
    const { value } = event.target;

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
    const { inputs, layers, onSubmit } = this.props;
    return (
      <form className="process-form">
        {inputs.map((formInput, i) => (
          <div>
            <h3>{formInput.title}</h3>
            <p>{formInput.abstractValue}</p>
            {formInput.type === InputTypes.COMPLEX ? (
              <div>
                <LayersIcon className="process-form-icon" />
                <LayerInput
                  className="layer-select"
                  layers={layers}
                  key={i}
                  id={i}
                  value={formInput.values[0]}
                  onSelect={this.handleAddComplexData}
                />
              </div>
            ) : (
              <div>
                <TextIcon className="process-form-icon" />
                <input
                  className="literal-text-input"
                  key={formInput.identifier}
                  onChange={this.handleAddLiteralData}
                  value={formInput.values[0]}
                  id={`form-input-${i}`}
                  type="text"
                />
              </div>
            )}
          </div>
        ))}
        <button type="button" className="execute-button" onClick={onSubmit}>
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
