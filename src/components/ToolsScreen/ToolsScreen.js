import React from 'react';
import Select from 'react-select';

import { pyWpsUrl, version } from '../../config';

export default class ToolsScreen extends React.Component {
  constructor () {
    super();

    this.state = {
      processes: [],
    };

    this.getCapabilitiesCallback = this.getCapabilitiesCallback.bind(this);
    this.getDescribeCallback = this.getDescribeCallback.bind(this);
  }

  componentDidMount () {
    this.wps = new window.WpsService({
      url: pyWpsUrl,
      version: version,
    });

    this.wps.getCapabilities_GET(this.getCapabilitiesCallback);
    this.wps.describeProcess_GET();
  }

  getCapabilitiesCallback (response) {
    const capabilities = response.capabilities;
    this.setState({processes: capabilities.processes});
    this.wps.describeProcess_GET(this.getDescribeCallback,
      capabilities.processes[0].identifier);
  }

  getDescribeCallback (response) {
    console.log(response);
    this.setState({response});
  }

  render () {
    return (
      <div style={{margin: '2.5%'}}>
        <Select options={this.state.processes.map(process => ({
          value: process.identifier,
          label: process.identifier,
        }))}/>
      </div>
    );
  }
}