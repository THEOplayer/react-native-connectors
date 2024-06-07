import { DefaultEventDispatcher } from '../event/DefaultEventDispatcher';
import { BaseEvent } from '../event/BaseEvent';

export interface VideoFramesMetrics {
  droppedVideoFrames: number;
  totalVideoFrames: number;
}

export enum AgamaMetricsEventType {
  SEGMENT_RESPONSE_ = 'segmentresponse',
  MANIFEST_RESPONSE_ = 'manifestresponse',
}

export interface AgamaMetricsEventMap {
  [AgamaMetricsEventType.SEGMENT_RESPONSE_]: AgamaMetricsSegmentResponseEvent;
  [AgamaMetricsEventType.MANIFEST_RESPONSE_]: AgamaMetricsManifestResponseEvent;
}

/**
 * AgamaMetricsSegmentResponseEvent
 *
 * - status: response status code (e.g. 200);
 * - mediaType: either AUDIO or VIDEO;
 * - totalBytesLoaded: segment size, in bytes;
 */
export class AgamaMetricsSegmentResponseEvent extends BaseEvent<AgamaMetricsEventType.SEGMENT_RESPONSE_> {
  constructor(
    public status: number,
    public mediaType: MediaType,
    public totalBytesLoaded: number,
  ) {
    super(AgamaMetricsEventType.SEGMENT_RESPONSE_);
  }
}

export class AgamaMetricsManifestResponseEvent extends BaseEvent<AgamaMetricsEventType.MANIFEST_RESPONSE_> {
  constructor(public uri: string) {
    super(AgamaMetricsEventType.MANIFEST_RESPONSE_);
  }
}

export enum MediaType {
  AUDIO = 'audio',
  VIDEO = 'video',
}

/**
 * AgamaMetrics bridges Metrics and SegmentResponse functionality.
 */
export abstract class AgamaMetrics extends DefaultEventDispatcher<AgamaMetricsEventMap> {
  abstract destroy(): void;

  abstract videoFrames(): Promise<VideoFramesMetrics>;

  /**
   * Returns player.metrics.currentBandwidthEstimate; in bits per second.
   */
  abstract bandwidth(): Promise<number>;
}
