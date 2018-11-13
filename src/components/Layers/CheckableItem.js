import React from "react";
import PropTypes from "prop-types";
import Checkbox from "./checkbox";

export default class CheckableItem extends React.Component {
    onClick = identifier => this.props.onClick(identifier);

  render() {
    const { value, highlight, data, content } = this.props;
    return (
      <div className={`layer ${highlight ? "highlighted" : ""}`}>
        <Checkbox
          isDisplayed={value}
          onClick={this.onClick}
          identifier={data}
        />
        <span>{content}</span>
      </div>
    );
  }
}

CheckableItem.propTypes = {
  onClick: PropTypes.func,
  constent: PropTypes.any,
  highlight: PropTypes.bool,
  value: PropTypes.bool,
  content: PropTypes.string
};
