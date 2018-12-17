import React from "react";
import { TextIcon, NumberIcon, ExclamationMarkIcon } from "../Icons/Icons";
import { getTypeInput } from "./LiteralInputTypes";

export default class LiteralInput extends React.Component {
  onChange = value => {
    this.props.onChange(this.props.i, value);
  };

  render() {
    const { literalDataDomains } = this.props.dataType;
    const typeName =
      literalDataDomains.length > 0 && literalDataDomains[0].dataType
        ? literalDataDomains[0].dataType.type
        : null;

    const { InputComponent, Validator, IconComponent } = getTypeInput(typeName);

    const { value } = this.props;
    return (
      <div>
        <div className="process-form-icon">
          <IconComponent />
          {value !== undefined && !Validator(value) ? (
            <ExclamationMarkIcon className="exclamation-mark" />
          ) : null}
        </div>
        <InputComponent onChange={this.onChange} value={value} />
      </div>
    );
  }
}
