import Input from "./Input";

/**
 * @param {object} processDescription
 * @returns {Input}
 */
export function generateInputsFromDescription(process) {
  return process.inputs.map(input => {
  const { abstractValue, title, identifier, minOccurs, maxOccurs } = input;
  let type = input.hasOwnProperty("complexData")
    ? InputTypes.COMPLEX
    : InputTypes.LITERAL;

  return new Input(identifier, type, title, abstractValue, minOccurs, maxOccurs);

  });
}

export const InputTypes = {
  COMPLEX: 0,
  LITERAL: 1
};
