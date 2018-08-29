import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './LayerInput.css';

class LayerInput extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      urlValue: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange (event) {
    this.setState({urlValue: event.target.value});
  }

  handleClick () {
    axios.get(this.state.urlValue).then(res => this.props.addLayer('Input layer', res.data))
  }

  render () {
    return (
      <div>
        <input
          type="text"
          className="url-input"
          placeholder="Enter a layer URL"
          value={this.state.urlValue}
          onChange={this.handleChange}
        />
        <button
          type="button"
          className="add-button"
          onClick={this.handleClick}
        >Add Layer</button>
      </div>
    );
  }
}

LayerInput.propTypes = {
  addLayer: PropTypes.func.isRequired,
};

export default LayerInput;