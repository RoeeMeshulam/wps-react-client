import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LayerInput from '../../containers/LayerInputContainer';

import './ProcessForm.css';

const MIME_TYPE = 'application/vnd.geo+json';

class ProcessForm extends React.Component {
  constructor (props) {
    super(props);

    this.inputValues = [];
    this.handleAddComplexData = this.handleAddComplexData.bind(this);
    this.handleAddLiteralData = this.handleAddLiteralData.bind(this);
    this.inputGenerator = new window.InputGenerator();
  }

  handleAddComplexData (identifier, event) {
    const value = event.target.value;
    _.pullAllBy(this.inputValues, [{'identifier': identifier}], 'identifier');
    const newInput = this.inputGenerator.createComplexDataInput_wps_1_0_and_2_0(
      identifier, MIME_TYPE, undefined, undefined, true, value);
    this.inputValues.push(newInput);
  }

  handleAddLiteralData (identifier, event) {
    const value = event.target.value;
    _.pullAllBy(this.inputValues, [{'identifier': identifier}], 'identifier');
    const newInput = this.inputGenerator.createLiteralDataInput_wps_1_0_and_2_0(
      identifier, undefined, undefined, value);
    this.inputValues.push(newInput);
  }

  render () {
    const {inputs, handleOnSubmit} = this.props;
    return (
      <form>
        {inputs.map(input =>
          <div>
            <h3>{input.title}</h3>
            <p>{input.abstractValue}</p>
            {input.hasOwnProperty('complexData')
              ? <LayerInput
                key={input.identifier}
                onBlur={this.handleAddComplexData.bind(null,
                  input.identifier)}/>
              : <input key={input.identifier}
                       onBlur={this.handleAddLiteralData.bind(null,
                         input.identifier)}
                       type="text"/>}
          </div>)}
        <button type="submit" onClick={() => handleOnSubmit(this.inputValues)}>
          Execute
        </button>
      </form>
    );
  }
}

ProcessForm.propTypes = {
  inputs: PropTypes.array.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
};

export default  ProcessForm;
