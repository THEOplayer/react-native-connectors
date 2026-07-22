import {
  PlayerEventType,
  type EventListener,
  type PlayerEventMap,
  type THEOplayer,
  type VideoQuality,
  isVideoQuality,
} from 'react-native-theoplayer';

interface NpawPlaybackFlags {
  isStarted: boolean;
  isJoined: boolean;
  isPaused: boolean;
  isSeeking: boolean;
  isBuffering: boolean;
  reset(): void;
}

interface NpawVideoAdapterBase {
  fireStart(params?: object, triggeredEvent?: string): void;
  fireJoin(params?: object, triggeredEvent?: string): void;
  firePause(params?: object, triggeredEvent?: string): void;
  fireResume(params?: object, triggeredEvent?: string): void;
  fireBufferBegin(params?: object, convertFromSeek?: boolean, triggeredEvent?: string): void;
  fireBufferEnd(params?: object, triggeredEvent?: string): void;
  fireStop(params?: object, triggeredEvent?: string): void;
  fireError(code?: string | object, msg?: string, metadata?: object, level?: string, triggeredEvent?: string): void;
  fireSeekBegin(params?: object, convertFromBuffer?: boolean, triggeredEvent?: string): void;
  fireSeekEnd(params?: object, triggeredEvent?: string): void;
  getNpawUtils(): {
    buildRenditionString(width?: number, height?: number, bitrate?: number): string;
  };
}

type PlayerEvent = PlayerEventMap[PlayerEventType];
type PlayerListener = EventListener<PlayerEvent>;
type PlayerReference = {
  type: PlayerEventType;
  listener: PlayerListener;
};

export class TheoplayerAdapter implements NpawVideoAdapterBase {
  protected player!: THEOplayer;
  protected flags!: NpawPlaybackFlags;
  protected references!: PlayerReference[];

  fireStart!: NpawVideoAdapterBase['fireStart'];
  fireJoin!: NpawVideoAdapterBase['fireJoin'];
  firePause!: NpawVideoAdapterBase['firePause'];
  fireResume!: NpawVideoAdapterBase['fireResume'];
  fireBufferBegin!: NpawVideoAdapterBase['fireBufferBegin'];
  fireBufferEnd!: NpawVideoAdapterBase['fireBufferEnd'];
  fireStop!: NpawVideoAdapterBase['fireStop'];
  fireError!: NpawVideoAdapterBase['fireError'];
  fireSeekBegin!: NpawVideoAdapterBase['fireSeekBegin'];
  fireSeekEnd!: NpawVideoAdapterBase['fireSeekEnd'];
  getNpawUtils!: NpawVideoAdapterBase['getNpawUtils'];

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
      this.reference(PlayerEventType.PLAY, this.playListener),
      this.reference(PlayerEventType.PLAYING, this.playingListener),
      this.reference(PlayerEventType.PAUSE, this.pauseListener),
      this.reference(PlayerEventType.WAITING, this.waitingListener),
      this.reference(PlayerEventType.SEEKING, this.seekingListener),
      this.reference(PlayerEventType.SEEKED, this.seekedListener),
      this.reference(PlayerEventType.TIME_UPDATE, this.timeUpdateListener),
      this.reference(PlayerEventType.SOURCE_CHANGE, this.sourceChangeListener),
      this.reference(PlayerEventType.CURRENT_SOURCE_CHANGE, this.sourceChangeListener),
      this.reference(PlayerEventType.ENDED, this.endedListener),
      this.reference(PlayerEventType.ERROR, this.errorListener),
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

  private playListener(): void {
    if (!this.flags.isStarted) {
      this.fireStart({}, 'playListener');
    }
  }

  private playingListener(): void {
    if (this.flags.isSeeking && !this.flags.isPaused) {
      this.fireSeekEnd({}, 'playingListener');
    }
    if (this.flags.isBuffering && !this.flags.isPaused) {
      this.fireBufferEnd({}, 'playingListener');
    }
    this.fireResume({}, 'playingListener');
    if (!this.flags.isStarted) {
      this.fireStart({}, 'playingListener');
    }
    if (!this.flags.isJoined) {
      this.fireJoin({}, 'playingListener');
    }
  }

  private pauseListener(): void {
    if (!this.flags.isSeeking) {
      this.firePause({}, 'pauseListener');
    }
  }

  private waitingListener(): void {
    if (!this.flags.isPaused && !this.flags.isSeeking) {
      this.fireBufferBegin({}, false, 'waitingListener');
    }
  }

  private seekingListener(): void {
    if (!this.flags.isSeeking) {
      this.fireSeekBegin({}, false, 'seekingListener');
    }
  }

  private seekedListener(): void {
    if (this.flags.isSeeking) {
      this.fireSeekEnd({}, 'seekedListener');
    }
  }

  private timeUpdateListener(event: PlayerEvent): void {
    const currentTime = 'currentTime' in event && typeof event.currentTime === 'number' ? event.currentTime : this.player.currentTime;
    this.lastPlayhead = currentTime;
    if (!this.flags.isStarted && this.lastPlayhead > 0) {
      this.fireStart({}, 'timeUpdateListener');
      this.fireJoin({}, 'timeUpdateListener');
    }
    if (!this.flags.isPaused) {
      this.fireSeekEnd({}, 'timeUpdateListener');
      this.fireBufferEnd({}, 'timeUpdateListener');
    }
  }

  private sourceChangeListener(): void {
    if (this.flags.isStarted) {
      this.fireStop({}, 'sourceChangeListener');
    }
    this.flags.reset();
    this.lastPlayhead = undefined;
  }

  private endedListener(): void {
    if (this.flags.isStarted) {
      this.fireStop({}, 'endedListener');
    }
  }

  private errorListener(event: PlayerEvent): void {
    if ('error' in event) {
      const error = event.error;
      if (typeof error === 'string') {
        this.fireError('GENERIC_ERROR', error, undefined, undefined, 'errorListener');
      } else if (typeof error === 'object' && error !== null && 'errorCode' in error && 'errorMessage' in error) {
        this.fireError(String(error.errorCode), String(error.errorMessage), undefined, undefined, 'errorListener');
      } else {
        this.fireError('GENERIC_ERROR', String(error), undefined, undefined, 'errorListener');
      }
    }
  }
}
