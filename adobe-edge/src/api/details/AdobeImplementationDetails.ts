/**
 * Details about the SDK, library, or service used in an application or web page implementation of a service.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/implementationdetails.schema.md
 */
export interface AdobeImplementationDetails {
  // The environment of the implementation
  environment?: AdobeEnvironment;

  // SDK or endpoint identifier. All SDKs or endpoints are identified through a URI, including extensions.
  name?: string;

  // The version identifier of the API, e.g h.18.
  version?: string;
}

/**
 * The environment of the implementation.
 */
export enum AdobeEnvironment {
  BROWSER = 'browser',
  APP = 'app',
  SERVER = 'server',
  IOT = 'iot',
}
