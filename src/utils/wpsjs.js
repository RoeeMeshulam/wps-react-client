import Promise from "bluebird";
import { InputTypes } from "../components/ProcessForm/ProcessFormUtils";

if (!window.WpsService) {
  console.error("wpsjs Failed to load");
}

const MIME_TYPE = "application/vnd.geo+json";
let inputGenerator = null;
let outputGenerator = null;

function throwIfError(res) {
  if (res.hasOwnProperty("errorThrown")) {
    throw res.errorThrown;
  }
}

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
  return new Promise(resolve => {
    wpsInstance.getCapabilities_GET(res => {
      throwIfError(res);
      resolve(res.capabilities);
    });
  });
}

export function DescribeProcess(wpsInstance, identifier) {
  return new Promise(resolve => {
    wpsInstance.describeProcess_GET(res => {
      throwIfError(res);
      resolve(res.processOffering.process);
    }, identifier);
  });
}

export function ExecuteProcess(
  wpsInstance,
  inputs,
  processDescription,
  layerFromIdFetcher,
  mimetype
) {
  return new Promise(resolve => {
    const { identifier } = processDescription;
    const outputGenerator = new GetOutputGenerator();
    // const outputs = [];
    const outputs = processDescription.outputs.map(output => {
      if (output.hasOwnProperty("complexData")) {
        let geoJsonOutput = output.complexData.formats.filter(
          format => format.mimeType === mimetype
        )[0];
        if (!geoJsonOutput) {
          console.warn(
            `application/vnd.geo+json output not found for ${output.identifier}`
          ); // todo handle more gracefuly
          geoJsonOutput = output.complexData.formats[0];
        }

        return outputGenerator.createComplexOutput_WPS_1_0(
          output.identifier,
          geoJsonOutput.mimeType,
          geoJsonOutput.schema,
          geoJsonOutput.encoding,
          "value"
        );
      } else if (output.hasOwnProperty("literalData")) {
        return outputGenerator.createLiteralOutput_WPS_1_0(
          output.identifier,
          "value"
        );
      }
      return null;
    });

    // Array of arrays of WPS inputs
    const inputsByIdentifier = inputs.map(input =>
      input.values.map(
        value =>
          input.type === InputTypes.COMPLEX
            ? GenerateComplexInput(input.id, layerFromIdFetcher(value))
            : GenerateLiteralInput(input.id, value)
      )
    );

    const flatInputs = Array.prototype.concat.apply([], inputsByIdentifier);

    wpsInstance.execute(
      resolve,
      identifier,
      "document",
      "sync",
      false,
      flatInputs,
      outputs
    );
  }).then(res => {
    throwIfError(res);
    return res.executeResponse;
  });
}
