import Promise from "bluebird";

if (!window.WpsService) {
  console.error("wpsjs Failed to load");
}

const MIME_TYPE = "application/vnd.geo+json";
let inputGenerator = null;
let outputGenerator = null;

export function CreateClientInstance(url, version) {
  return new window.WpsService({ url, version });
}

export function GetInputGenerator(url, version) {
  if (!inputGenerator) inputGenerator = new window.InputGenerator();
  return inputGenerator;
}

export function GetOutputGenerator(url, version) {
  if (!outputGenerator) outputGenerator = new window.OutputGenerator();
  return outputGenerator;
}

export function GenerateComplexInput(identifier, value) {
  return GetInputGenerator().createComplexDataInput_wps_1_0_and_2_0(
    identifier,
    MIME_TYPE,
    undefined,
    undefined,
    true,
    value
  );
}

export function GenerateLiteralInput(identifier, value) {
  return GetInputGenerator().createLiteralDataInput_wps_1_0_and_2_0(
    identifier,
    undefined,
    undefined,
    value
  );
}

export function GetCapabilies(wpsInstance) {
  return new Promise((resolve, reject) => {
    wpsInstance.getCapabilities_GET(res => {
      if(res.hasOwnProperty("errorThrown")){
        reject(res.errorThrown)
      } else {
        resolve(res.capabilities)
      }
    })
  });
}
