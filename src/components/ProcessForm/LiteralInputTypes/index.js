import InputType from "./InputType";
import { NumberIcon, TextIcon, TrueFalseIcon } from "../../Icons/Icons";
import BooleanInput from "./BooleanInput";
import TextInput from "./TextInput";

// Non impelemented yet types : ('anyURI', 'time', 'date', 'dateTime','scale', 'angle')

const DEFAULT_TYPE = "string";
const types = [
  new InputType(
    "nonNegativeInteger",
    value => value.match(/^[+]?[0-9]+$/) !== null,
    TextInput,
    NumberIcon
  ),
  new InputType(
    "positiveInteger",
    value => value.match(/^[+]?[0-9]*[1-9][0-9]*$/) !== null,
    TextInput,
    NumberIcon
  ),
  new InputType(
    "integer",
    value => value.match(/^[+-]?[0-9]+$/) !== null,
    TextInput,
    NumberIcon
  ),
  new InputType(
    "float",
    value => value.match(/^[+-]?([0-9]*[.])?[0-9]+$/) !== null,
    TextInput,
    NumberIcon
  ),
  new InputType("string", () => true, TextInput, TextIcon),
  new InputType("boolean", () => true, BooleanInput, TrueFalseIcon)
];

const typesMap = {};
types.forEach(type => {
  typesMap[type.name] = type;
});
/**
 * 
 * @param {string} type 
 * @returns {InputType} 
 */
export function getTypeInput(type) {
  return typesMap[type] || typesMap[DEFAULT_TYPE];
}
