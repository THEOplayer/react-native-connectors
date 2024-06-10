import type { AdobeIdentityMap } from './AdobeIdentityMap';
import type { AdobeMediaDetails } from '../api/details/AdobeMediaDetails';
import type { AdobeImplementationDetails } from '../api/details/AdobeImplementationDetails';
import type { EventType } from './EventType';

/**
 * Used to indicate the behavior of time partitioned semantics when composed into data schemas.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/behaviors/time-series.schema.md
 */
export interface AdobeTimeSeries {
  // The primary event type for this time-series record.
  eventType: EventType;

  // The time when an event or observation occurred.
  timestamp: string;

  // Custom metadata details information.
  mediaCollection: AdobeMediaDetails;

  // Defines a map containing a set of end user identities
  identityMap?: AdobeIdentityMap;

  // Details about the SDK, library, or service used in an application or web page implementation of a service.
  implementationDetails?: AdobeImplementationDetails;
}
