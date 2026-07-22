// noinspection JSUnusedGlobalSymbols

import {
  type EventListener,
  isVideoQuality,
  type PlayerEventMap,
  PlayerEventType,
  type THEOplayer,
  type VideoQuality,
} from 'react-native-theoplayer';

interface NpawPlaybackFlags {
  isStarted: boolean;
  isJoined: boolean;
  isPaused: boolean;
  isSeeking: boolean;
  isBuffering: boolean;
  reset(): void;
}

type PlayerEvent = PlayerEventMap[PlayerEventType];
type PlayerListener = EventListener<PlayerEvent>;
type PlayerReference = {
  type: PlayerEventType;
  listener: PlayerListener;
};

export class TheoplayerAdapter {
  /**
   * Provided at runtime by NPAW's base video adapter; declared for typing only.
   * Implementations are copied onto the instance during registerAdapterFromClass.
   */
  protected player!: THEOplayer;
  protected flags!: NpawPlaybackFlags;
  protected references!: PlayerReference[];

  protected fireStart!: (params?: object, triggeredEvent?: string) => void;
  protected fireJoin!: (params?: object, triggeredEvent?: string) => void;
  protected firePause!: (params?: object, triggeredEvent?: string) => void;
  protected fireResume!: (params?: object, triggeredEvent?: string) => void;
  protected fireBufferBegin!: (params?: object, convertFromSeek?: boolean, triggeredEvent?: string) => void;
  protected fireBufferEnd!: (params?: object, triggeredEvent?: string) => void;
  protected fireStop!: (params?: object, triggeredEvent?: string) => void;
  protected fireError!: (code?: string | object, msg?: string, metadata?: object, level?: string, triggeredEvent?: string) => void;
  protected fireSeekBegin!: (params?: object, convertFromBuffer?: boolean, triggeredEvent?: string) => void;
  protected fireSeekEnd!: (params?: object, triggeredEvent?: string) => void;
  protected getNpawUtils!: () => {
    buildRenditionString(width?: number, height?: number, bitrate?: number): string;
  };

  private lastPlayhead?: number;

  getPlayhead(): number | undefined {
    try {
      this.lastPlayhead = this.player.currentTime;
      return this.lastPlayhead;
    } catch {
      return undefined;
    }
  }

  getDuration(): number | undefined {
    const duration = this.player.duration;
    return Number.isFinite(duration) ? duration : undefined;
  }

  getIsLive(): boolean {
    return !Number.isFinite(this.player.duration);
  }

  getResource(): string | undefined {
    const sources = this.player.source?.sources;
    const source = Array.isArray(sources) ? sources[0] : sources;
    return source?.src;
  }

  getRendition(): string | undefined {
    const quality = this.getActiveQuality();
    if (!quality || !isVideoQuality(quality)) {
      return undefined;
    }
    return this.getNpawUtils().buildRenditionString(quality.width, quality.height, quality.bandwidth);
  }

  getBitrate(): number | undefined {
    return this.getActiveQuality()?.bandwidth;
  }

  getPlayerName(): string {
    return 'THEOplayer';
  }

  getPlayerVersion(): string {
    return this.player.version.version;
  }

  getVersion(): string {
    return this.getPlayerVersion();
  }

  registerListeners(): void {
    this.references = [
      this.reference(PlayerEventType.PLAY, this.onPlay),
      this.reference(PlayerEventType.PLAYING, this.onPlaying),
      this.reference(PlayerEventType.PAUSE, this.onPause),
      this.reference(PlayerEventType.WAITING, this.onWaiting),
      this.reference(PlayerEventType.SEEKING, this.onSeeking),
      this.reference(PlayerEventType.SEEKED, this.onSeeked),
      this.reference(PlayerEventType.TIME_UPDATE, this.onTimeUpdate),
      this.reference(PlayerEventType.SOURCE_CHANGE, this.onSourceChange),
      this.reference(PlayerEventType.CURRENT_SOURCE_CHANGE, this.onSourceChange),
      this.reference(PlayerEventType.ENDED, this.onEnded),
      this.reference(PlayerEventType.ERROR, this.onError),
    ];

    for (const reference of this.references) {
      this.player.addEventListener(reference.type, reference.listener);
    }
  }

  unregisterListeners(): void {
    for (const reference of this.references) {
      this.player.removeEventListener(reference.type, reference.listener);
    }
    this.references = [];
  }

  private reference(type: PlayerEventType, listener: PlayerListener): PlayerReference {
    return {
      type,
      listener: listener.bind(this),
    };
  }

  private getActiveQuality(): VideoQuality | undefined {
    return this.player.videoTracks.find((track) => track.enabled && isVideoQuality(track.activeQuality))?.activeQuality as VideoQuality | undefined;
  }

  private onPlay(): void {
    if (!this.flags.isStarted) {
      this.fireStart({}, 'onPlay');
    }
  }

  private onPlaying(): void {
    if (this.flags.isSeeking && !this.flags.isPaused) {
      this.fireSeekEnd({}, 'onPlaying');
    }
    if (this.flags.isBuffering && !this.flags.isPaused) {
      this.fireBufferEnd({}, 'onPlaying');
    }
    this.fireResume({}, 'onPlaying');
    if (!this.flags.isStarted) {
      this.fireStart({}, 'onPlaying');
    }
    if (!this.flags.isJoined) {
      this.fireJoin({}, 'onPlaying');
    }
  }

  private onPause(): void {
    if (!this.flags.isSeeking) {
      this.firePause({}, 'onPause');
    }
  }

  private onWaiting(): void {
    if (!this.flags.isPaused && !this.flags.isSeeking) {
      this.fireBufferBegin({}, false, 'onWaiting');
    }
  }

  private onSeeking(): void {
    if (!this.flags.isSeeking) {
      this.fireSeekBegin({}, false, 'onSeeking');
    }
  }

  private onSeeked(): void {
    if (this.flags.isSeeking) {
      this.fireSeekEnd({}, 'onSeeked');
    }
  }

  private onTimeUpdate(event: PlayerEvent): void {

    this.lastPlayhead = 'currentTime' in event && typeof event.currentTime === 'number' ? event.currentTime : this.player.currentTime;
    if (!this.flags.isStarted && this.lastPlayhead > 0) {
      this.fireStart({}, 'onTimeUpdate');
      this.fireJoin({}, 'onTimeUpdate');
    }
    if (!this.flags.isPaused) {
      this.fireSeekEnd({}, 'onTimeUpdate');
      this.fireBufferEnd({}, 'onTimeUpdate');
    }
  }

  private onSourceChange(): void {
    if (this.flags.isStarted) {
      this.fireStop({}, 'onSourceChange');
    }
    this.flags.reset();
    this.lastPlayhead = undefined;
  }

  private onEnded(): void {
    if (this.flags.isStarted) {
      this.fireStop({}, 'onEnded');
    }
  }

  private onError(event: PlayerEvent): void {
    if ('error' in event) {
      const error = event.error;
      if (typeof error === 'string') {
        this.fireError('GENERIC_ERROR', error, undefined, undefined, 'onError');
      } else if (typeof error === 'object' && error !== null && 'errorCode' in error && 'errorMessage' in error) {
        this.fireError(String(error.errorCode), String(error.errorMessage), undefined, undefined, 'onError');
      } else {
        this.fireError('GENERIC_ERROR', String(error), undefined, undefined, 'onError');
      }
    }
  }
}
