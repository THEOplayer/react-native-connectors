/**
 * Defines a map containing a set of end user identities, keyed on either namespace integration code or the namespace
 * ID of the identity. The values of the map are an array, meaning that more than one identity of each namespace may
 * be carried.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/mixins/shared/identitymap.schema.md
 */
export type AdobeIdentityMap = { [key: string]: object[] };
