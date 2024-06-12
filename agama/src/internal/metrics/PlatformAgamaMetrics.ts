import { NativeEventEmitter, NativeModules } from 'react-native';
import type { THEOplayer } from 'react-native-theoplayer';
import { AgamaMetrics, AgamaMetricsManifestResponseEvent, AgamaMetricsSegmentResponseEvent, MediaType, VideoFramesMetrics } from './AgamaMetrics';

interface NativeSegmentResponseEvent {
  status: number;
  mediaType: MediaType;
  totalBytesLoaded: number;
}

interface NativeManifestResponseEvent {
  uri: string;
}

/**
 * AgamaMetrics bridges Metrics and SegmentResponse functionality.
 */
export class PlatformAgamaMetrics extends AgamaMetrics {
  private _player: THEOplayer;
  private _emitter: NativeEventEmitter;

  constructor(player: THEOplayer) {
    super();
    this._player = player;
    this._emitter = new NativeEventEmitter(NativeModules.AgamaModule);
    this._emitter.addListener('onManifestResponse', this.onManifestResponse);
    this._emitter.addListener('onSegmentResponse', this.onSegmentResponse);
    NativeModules.AgamaModule.initialize(this._player.nativeHandle, { debug: __DEBUG__ });
  }

  public destroy() {
    NativeModules.AgamaModule.destroy(this._player.nativeHandle);
  }

  async videoFrames(): Promise<VideoFramesMetrics> {
    return NativeModules.AgamaModule.videoFrames(this._player.nativeHandle);
  }

  /**
   * Returns _player.metrics.currentBandwidthEstimate; in bits per second.
   */
  async bandwidth(): Promise<number> {
    return NativeModules.AgamaModule.bandwidth(this._player.nativeHandle);
  }

  private onSegmentResponse = (event: NativeSegmentResponseEvent) => {
    this.dispatchEvent(new AgamaMetricsSegmentResponseEvent(event.status, event.mediaType, event.totalBytesLoaded));
  };

  private onManifestResponse = (event: NativeManifestResponseEvent) => {
    this.dispatchEvent(new AgamaMetricsManifestResponseEvent(event.uri));
  };
}
