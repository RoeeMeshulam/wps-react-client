import React from "react";

import { CheckboxOnIcon, CheckboxOffIcon } from "../Icons/Icons";

export default class Checkbox extends React.Component {
  constructor(props){
    super(props)

    this.onClick = this.onClick.bind(this);
  }

  onClick(){
    this.props.onClick(this.props.identifier)
  }

  render() {
    const { isDisplayed } = this.props;
    const checkbox = isDisplayed ? <CheckboxOnIcon /> : <CheckboxOffIcon />;
    return <span onClick={this.onClick}>{checkbox}</span>;
  }
}
