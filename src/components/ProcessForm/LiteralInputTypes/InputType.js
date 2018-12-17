export default class InputType {
  constructor(name,validator, inputComponent, iconComponent) {
      this.name = name;
      this.Validator = validator;
      this.InputComponent = inputComponent;
      this.IconComponent = iconComponent;
  }
}
