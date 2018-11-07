import Input from "./Input";

/**
 * @param {object} processDescription
 * @returns {Input}
 */
export function generateInputsFromDescription(process) {
  return process.inputs.map(input => {
    const { abstractValue, title, identifier, minOccurs, maxOccurs } = input;
    const [type, formats] = input.hasOwnProperty("complexData")
      ? [InputTypes.COMPLEX, input.complexData.formats]
      : [InputTypes.LITERAL, undefined]

    return new Input(
      identifier,
      type,
      title,
      abstractValue,
      minOccurs,
      maxOccurs,
      formats
    );
  });
}

export const InputTypes = {
  COMPLEX: 0,
  LITERAL: 1
};
