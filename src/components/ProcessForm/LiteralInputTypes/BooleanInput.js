import React from "react";

export default class BooleanInput extends React.Component {
  onChange = event => this.props.onChange(event.target.checked);

  render() {
    const { value } = this.props;
    return <input onChange={this.onChange} value={value} type="checkbox" />;
  }
}
