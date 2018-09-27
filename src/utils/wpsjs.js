if(!window.WpsService) {
    console.error("wpsjs Failed to load")
}

let inputGenerator = null;
let outputGenerator = null;

export function CreateClientInstance(url, version) {
  return new window.WpsService({ url, version });
}
  
export function GetInputGenerator(url, version) {
  if(!inputGenerator)
    inputGenerator = new window.InputGenerator();
    return inputGenerator;
  }
  
export function GetOutputGenerator(url, version) {
  if(!outputGenerator)
    outputGenerator = new window.OutputGenerator();
  return outputGenerator;
}
