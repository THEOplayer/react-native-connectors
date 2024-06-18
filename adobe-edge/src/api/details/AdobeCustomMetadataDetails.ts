/**
 * Custom metadata details information.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/custommetadatadetails.schema.md
 */
export type AdobeCustomMetadataDetails = {
  // The name of the custom field.
  name?: string;

  // The value of the custom field.
  value?: string;
};
