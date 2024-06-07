import { AgamaClient, AgamaMeasurement } from '../AgamaClient';
import { AbstractAgamaHandler } from './AbstractAgamaHandler';
import { emptyArray } from '../utils/ArrayUtils';
import type { THEOplayer } from 'react-native-theoplayer';
import { findMediaTrackByUid } from 'react-native-theoplayer';
import { NumberTimeRanges } from '../utils/NumberTimeRanges';
import { toKiloBitsPerSecond } from '../utils/ByteUtils';
import type { AgamaMetrics } from '../metrics/AgamaMetrics';
import { AgamaMetricsEventType, AgamaMetricsSegmentResponseEvent } from '../metrics/AgamaMetrics';

/**
 * AgamaMeasurementHandler monitors the following attributes:
 * - Number of frames dropped (AgamaMeasurement.NUMBER_OF_FRAMES_DROPPED_);
 * - Number of frames decoded (AgamaMeasurement.NUMBER_OF_FRAMES_DECODED_);
 * - Total number of bytes received (AgamaMeasurement.BYTES_RECEIVED);
 * - Bandwidth measurements (AgamaMeasurement.SEGMENT_READ_BITRATE_, AgamaMeasurement.SEGMENT_PROFILE_BITRATE_, AgamaMeasurement.VIDEO_PROFILE_BITRATE_);
 * - status code counts (AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_XXX_)
 * - current buffer length (AgamaMeasurement.BUFFER_LENGTH_);
 * - current play-back position (AgamaMeasurement.PLAYBACK_POSITION_).
 */
export class AgamaMeasurementHandler extends AbstractAgamaHandler {
  private _statusCodeCounts: { [key: string]: number } = {};
  private _totalBytesReceived = 0;
  private _metricsAgamaMetrics: AgamaMetrics;
  private _droppedFramesFromPreviousSessions = 0;
  private _decodedFramesFromPreviousSessions = 0;
  private _loopIds: ReturnType<typeof setInterval>[] = [];

  constructor(player: THEOplayer, agamaClient: AgamaClient, metrics: AgamaMetrics) {
    super(player, agamaClient);
    this._metricsAgamaMetrics = metrics;
  }

  async startReporting_(): Promise<void> {
    super.startReporting_();
    const videoFrames = await this._metricsAgamaMetrics.videoFrames();
    this._droppedFramesFromPreviousSessions = videoFrames.droppedVideoFrames;
    this._decodedFramesFromPreviousSessions = videoFrames.totalVideoFrames;
    this.attachReportingListeners_();
    this._loopIds.push(setInterval(this.oneSecondLoop_, 1000));
  }

  protected beforePauseReporting_(): void {
    super.beforePauseReporting_();
    this.reportPlaybackPosition_();
  }

  unload_(): void {
    this._metricsAgamaMetrics.destroy();
    this.reportPlaybackPosition_();
    this.removeReportingListeners_();
    this._loopIds.forEach(clearInterval);
    emptyArray(this._loopIds);
    super.unload_();
  }

  private attachReportingListeners_(): void {
    this._metricsAgamaMetrics.addEventListener(AgamaMetricsEventType.SEGMENT_RESPONSE_, this.handleSegmentResponse);
  }

  private removeReportingListeners_(): void {
    this._metricsAgamaMetrics.removeEventListener(AgamaMetricsEventType.SEGMENT_RESPONSE_, this.handleSegmentResponse);
  }

  onViewStateChange_(): void {
    this.reportPlaybackPosition_();
  }

  // public for testing
  readonly oneSecondLoop_ = (): void => {
    void this.reportFrames_();
    this.reportBufferLength_();
  };

  private readonly handleSegmentResponse = (segmentResponseEvent: AgamaMetricsSegmentResponseEvent): void => {
    this.updateTotalBytesReceived_(segmentResponseEvent.totalBytesLoaded);
    void this.reportEstimatedBandWidth_();
    this.reportBandWidth_();
    this.reportPlaybackPosition_();
    this.updateStatusCodeCounts_(segmentResponseEvent.status);
  };

  private updateTotalBytesReceived_(bytesReceived: number): void {
    this._totalBytesReceived += bytesReceived;
    this.reportMeasurement_(AgamaMeasurement.BYTES_RECEIVED_, this._totalBytesReceived);
  }

  private readonly updateStatusCodeCounts_ = (status: number): void => {
    const firstDigitStatusCode = status.toString()[0];
    const currentCount = this._statusCodeCounts[firstDigitStatusCode] || 0;
    this._statusCodeCounts[firstDigitStatusCode] = currentCount + 1;

    this.reportStatusCodeMeasurement_(AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_1XX_, '1');
    this.reportStatusCodeMeasurement_(AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_2XX_, '2');
    this.reportStatusCodeMeasurement_(AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_3XX_, '3');
    this.reportStatusCodeMeasurement_(AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_4XX_, '4');
    this.reportStatusCodeMeasurement_(AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_5XX_, '5');
  };

  private reportStatusCodeMeasurement_(measurement: AgamaMeasurement, firstDigitStatusCode: string): void {
    const statusCount = this._statusCodeCounts[firstDigitStatusCode] || 0;
    this.reportMeasurement_(measurement, statusCount);
  }

  private async reportFrames_() {
    const videoFrames = await this._metricsAgamaMetrics.videoFrames();
    const droppedFrames = videoFrames.droppedVideoFrames - this._droppedFramesFromPreviousSessions;
    const totalFrames = videoFrames.totalVideoFrames - this._decodedFramesFromPreviousSessions;
    this.reportMeasurement_(AgamaMeasurement.NUMBER_OF_FRAMES_DROPPED_, droppedFrames);
    this.reportMeasurement_(AgamaMeasurement.NUMBER_OF_FRAMES_DECODED_, totalFrames);
  }

  private async reportEstimatedBandWidth_(): Promise<void> {
    const bandwidth = await this._metricsAgamaMetrics.bandwidth();
    this.reportMeasurement_(AgamaMeasurement.SEGMENT_READ_BITRATE_, toKiloBitsPerSecond(bandwidth));
  }

  private reportBandWidth_(): void {
    const activeVideoTrack = findMediaTrackByUid(this._player.videoTracks, this._player.selectedVideoTrack);
    if (activeVideoTrack?.activeQuality) {
      const bandwidth = activeVideoTrack.activeQuality.bandwidth;
      this.reportMeasurement_(AgamaMeasurement.SEGMENT_PROFILE_BITRATE_, toKiloBitsPerSecond(bandwidth));
      this.reportMeasurement_(AgamaMeasurement.VIDEO_PROFILE_BITRATE_, toKiloBitsPerSecond(bandwidth));
    }
  }

  private reportPlaybackPosition_(): void {
    if (!this.isVod_()) {
      return;
    }
    const currentTimeInMs = Math.round(this._player.currentTime);
    this.reportMeasurement_(AgamaMeasurement.PLAYBACK_POSITION_, currentTimeInMs);
  }

  private reportBufferLength_(): void {
    const buffered = NumberTimeRanges.fromNative_(this._player.buffered);
    const currentTime = this._player.currentTime;
    const activeBuffer = buffered.subRangeAtTimestamp_(currentTime);
    const totalForwardBuffer = activeBuffer ? activeBuffer.end_(0) - currentTime : 0;
    this.reportMeasurement_(AgamaMeasurement.BUFFER_LENGTH_, totalForwardBuffer);
  }

  private reportMeasurement_(deviceMetadataType: AgamaMeasurement, metadata: number): void {
    if (this._isReporting) {
      this._agamaClient.setMeasurement_(deviceMetadataType, metadata);
    }
  }
}
