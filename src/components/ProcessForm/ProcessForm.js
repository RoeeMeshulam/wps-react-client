import React from "react";
import PropTypes from "prop-types";
import Input from "./Input";
import { InputTypes } from "./ProcessFormUtils";

import "./ProcessForm.css";
import ComplexInput from "./ComplexInput";
import LiteralInput from "./LiteralInput";

class ProcessForm extends React.Component {
  constructor(props) {
    super(props);

    this.inputValues = [];
    this.handleAddComplexData = this.handleAddComplexData.bind(this);
    this.inputGenerator = new window.InputGenerator();
  }

  handleAddComplexData(values, i) {
    const identifier = this.props.inputs[i].id;
    let inputs = this.props.inputs.map(input =>
      input.id === identifier
        ? Object.assign(new Input(), input, { values })
        : input
    );

    this.props.onChange(inputs);
  }

  handleAddLiteralData = (i,value) => {
    const identifier = this.props.inputs[i].id;

    const values = value !== undefined ? [value] : [];
    let inputs = this.props.inputs.map(input =>
      input.id === identifier
        ? Object.assign(new Input(), input, { values })
        : input
    );

    this.props.onChange(inputs);
  };

  render() {
    const { inputs, layers, onSubmit } = this.props;
    return (
      <form className="process-form">
        {inputs.map((formInput, i) => (
          <div key={`form-item-${i}`}>
            <h3>{formInput.title}</h3>
            <p>{formInput.abstractValue}</p>
            {formInput.type === InputTypes.COMPLEX ? (
              <ComplexInput
                onChange={this.handleAddComplexData}
                formInput={formInput}
                index={i}
                layers={layers}
              />
            ) : (
              <LiteralInput
                i={i}
                dataType={formInput.dataType}
                onChange={this.handleAddLiteralData}
                value={formInput.values[0]}
              />
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
