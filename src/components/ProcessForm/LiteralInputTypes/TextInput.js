import React from "react";

import './TextInput.css'

export default class TextInput extends React.Component {
  onChange = event => this.props.onChange(event.target.value);

  render() {

    const { value } = this.props;
    return <input
        className="literal-text-input"
        onChange={this.onChange}
        value={value}
        type="text"
      />
  }
}