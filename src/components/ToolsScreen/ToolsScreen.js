import React from 'react';
import _ from 'lodash';
import Select from 'react-select';

import { pyWpsUrl, version } from '../../config';
import ProcessForm from '../ProcessForm/ProcessForm';

export default class ToolsScreen extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      processes: [],
      processInputs: [],
    };

    this.getCapabilitiesCallback = this.getCapabilitiesCallback.bind(this);
    this.getDescribeCallback = this.getDescribeCallback.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.handleExecuteProcess = this.handleExecuteProcess.bind(this);
    this.handleExecuteResponse = this.handleExecuteResponse.bind(this);
  }

  componentDidMount () {
    this.wps = new window.WpsService({
      url: pyWpsUrl,
      version: version,
    });

    this.wps.getCapabilities_GET(this.getCapabilitiesCallback);
  }

  getCapabilitiesCallback (response) {
    const capabilities = response.capabilities;
    this.setState({processes: capabilities.processes});
  }

  handleProcessChange (selected) {
    this.wps.describeProcess_GET(this.getDescribeCallback, selected.value);
  }

  getDescribeCallback (response) {
    this.setState({selectedProcess: response.processOffering.process});
  }

  handleExecuteProcess (inputs) {
    const outputGenerator = new window.OutputGenerator();
    const outputs = [];
    const output = this.state.selectedProcess.outputs[0];
    if (output.hasOwnProperty('complexData')) {
      const geoJsonOutputIndex = _.findIndex(output.complexData.formats,
        ['mimeType', 'application/vnd.geo+json']);
      const geoJsonOutput = output.complexData.formats[geoJsonOutputIndex];
      outputs.push(
        outputGenerator.createComplexOutput_WPS_2_0(output.identifier,
          geoJsonOutput.mimeType, geoJsonOutput.schema, geoJsonOutput.encoding,
          'value'));
    } else if (output.hasOwnProperty('literalData')) {

    }
    this.wps.execute(this.handleExecuteResponse,
      this.state.selectedProcess.identifier, 'document', 'sync', false, inputs,
      outputs);
  }

  handleExecuteResponse (value) {
    console.log(value);
  }

  render () {
    const {processes, selectedProcess} = this.state;
    return (
      <div style={{margin: '2.5%'}}>
        <Select onChange={this.handleProcessChange}
                options={processes.map(process => ({
                  value: process.identifier,
                  label: process.identifier,
                }))}/>
        {selectedProcess
          ? <ProcessForm inputs={selectedProcess.inputs}
                         handleOnSubmit={this.handleExecuteProcess}
                         addLayer={this.props.addLayer}/>
          : null}
      </div>
    );
  }
}