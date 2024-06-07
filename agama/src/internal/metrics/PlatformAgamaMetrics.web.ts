import type { THEOplayer } from 'react-native-theoplayer';
import type { ChromelessPlayer } from 'theoplayer';
import { AgamaMetrics, VideoFramesMetrics } from './AgamaMetrics';
import type { InterceptableResponse } from 'theoplayer';
import { bytesToBits } from '../utils/ByteUtils';

/**
 * AgamaMetrics bridges Metrics and SegmentResponse functionality.
 */
export class PlatformAgamaMetrics extends AgamaMetrics {
  private _player: ChromelessPlayer;

  constructor(player: THEOplayer) {
    super();
    this._player = player.nativeHandle as ChromelessPlayer;
    this._player.network.addResponseInterceptor(this.onSegmentResponse);
  }

  public destroy() {
    this._player.network.removeResponseInterceptor(this.onSegmentResponse);
  }

  async videoFrames(): Promise<VideoFramesMetrics> {
    return Promise.resolve({
      droppedVideoFrames: this._player.metrics.droppedVideoFrames,
      totalVideoFrames: 0 /*TODO*/,
    });
  }

  /**
   * Returns _player.metrics.currentBandwidthEstimate; in bits per second.
   */
  async bandwidth(): Promise<number> {
    return Promise.resolve(bytesToBits(this._player.metrics.currentBandwidthEstimate));
  }

  private onSegmentResponse = (_response: InterceptableResponse) => {
    // TODO
    // this.dispatchEvent(new AgamaMetricsSegmentResponseEvent(response.status, response.mediaType, response.bytesLoaded));
    // this.dispatchEvent(new AgamaMetricsManifestResponseEvent(event.uri));
  };
}
