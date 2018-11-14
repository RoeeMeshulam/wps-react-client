export default function tryParseFloat(value, defaultValue) {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    try {
      return parseFloat(value);
    } catch (e) {
      return defaultValue;
    }
  } else {
    return defaultValue;
  }
}
