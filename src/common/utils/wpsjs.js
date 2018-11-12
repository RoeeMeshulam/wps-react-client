import Promise from "bluebird";
import { InputTypes } from "../../components/ProcessForm/ProcessFormUtils";

if (!window.WpsService) {
  console.error("wpsjs Failed to load");
}

let inputGenerator = null;
let outputGenerator = null;

function resolveResponse(response, fetchData) {
  if (!response) {
    return Promise.reject(new Error("Non-valid response"));
  } else if (response.hasOwnProperty("errorThrown")) {
    return Promise.reject(new Error(response.errorThrown));
  } else {
    return Promise.resolve(fetchData(response));
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

export function GenerateComplexInput(
  identifier,
  value,
  mimetype,
  complexAsReference
) {
  return GetInputGenerator().createComplexDataInput_wps_1_0_and_2_0(
    identifier,
    mimetype,
    undefined,
    undefined,
    complexAsReference,
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
    wpsInstance.getCapabilities_GET(resolve);
  }).then(res => resolveResponse(res, res => res.capabilities));
}

export function DescribeProcess(wpsInstance, identifier) {
  return new Promise(resolve =>
    wpsInstance.describeProcess_GET(resolve, identifier)
  ).then(response =>
    resolveResponse(response, response => response.processOffering.process)
  );
}

export function ExecuteProcess(
  wpsInstance,
  inputs,
  processDescription,
  layerFromIdFetcher,
  layerMimeTypeProdicate,
  complexAsReference
) {
  return new Promise(resolve => {
    const { identifier } = processDescription;
    const outputGenerator = new GetOutputGenerator();
    const outputs = processDescription.outputs.map(output => {
      if (output.hasOwnProperty("complexData")) {
        let geoJsonOutput = output.complexData.formats.filter(format =>
          layerMimeTypeProdicate(format.mimeType)
        )[0];
        if (!geoJsonOutput) {
          throw new Error(
            `Geographic mimetype output not found for output: ${
              output.identifier
            }`
          );
        }

        return outputGenerator.createComplexOutput_WPS_1_0(
          output.identifier,
          geoJsonOutput.mimeType,
          geoJsonOutput.schema,
          geoJsonOutput.encoding,
          undefined,
          complexAsReference
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
    // Denote: Some of data is promises, some is literal
    const inputsByIdentifier = inputs.map(input =>
      input.values.map(value => {
        if (input.type === InputTypes.COMPLEX) {
          return Promise.resolve(value.getData()).then(data =>
            GenerateComplexInput(
              input.id,
              data,
              value.mimeType,
              complexAsReference
            )
          );
        } else return GenerateLiteralInput(input.id, value);
      })
    );

    const flatInputsPromises   = Array.prototype.concat.apply(
      [],
      inputsByIdentifier
    );
    Promise.all(flatInputsPromises).then(flatInputs => {
      wpsInstance.execute(
        resolve,
        identifier,
        "document",
        "sync",
        false,
        flatInputs,
        outputs
      );
    });
  }).then(response => {
    return resolveResponse(response, response => response.executeResponse);
  });
}
