import { AdEventType, PlayerEventType, type Ad, type AdBreak, type AdEvent, type EventListener, type THEOplayer } from 'react-native-theoplayer';
import manifest from '../manifest.json';

type AdReference = {
  type: PlayerEventType.AD_EVENT;
  listener: EventListener<AdEvent>;
};

export class TheoplayerAdsAdapter {
  /**
   * Provided at runtime by NPAW's base ads adapter; declared for typing only.
   * Implementations are copied onto the instance during registerAdsAdapterFromClass.
   */
  protected player!: THEOplayer;
  protected references!: AdReference[];

  protected fireStart!: (params?: object, triggeredEvent?: string) => void;
  protected fireJoin!: (params?: object, triggeredEvent?: string) => void;
  protected fireStop!: (params?: object, triggeredEvent?: string) => void;
  protected fireError!: (
    code?: string | object,
    msg?: string,
    metadata?: object,
    level?: string,
    triggeredEvent?: string,
    fatalError?: boolean,
    duration?: number,
  ) => void;
  protected fireClick!: (params?: object) => void;
  protected fireQuartile!: (quartile: number) => void;
  protected fireSkip!: (params?: object) => void;
  protected fireBreakStart!: (params?: object) => void;
  protected fireBreakStop!: (params?: object) => void;

  private currentAd?: Ad;
  private currentAdBreak?: AdBreak;

  getDuration(): number | undefined {
    return this.currentAd?.duration;
  }

  getResource(): string | undefined {
    return this.currentAd?.resourceURI;
  }

  getTitle(): string | undefined {
    return this.currentAd?.id;
  }

  getPosition(): 'pre' | 'mid' | 'post' | undefined {
    const timeOffset = this.currentAdBreak?.timeOffset;
    const duration = this.player?.duration;
    if (timeOffset == null) {
      return undefined;
    }
    if (timeOffset === 0) {
      return 'pre';
    }
    if (timeOffset < 0 || (Number.isFinite(duration) && timeOffset >= duration / 1000)) {
      return 'post';
    }
    return 'mid';
  }

  getIsSkippable(): boolean {
    const skipOffset = this.currentAd?.skipOffset;
    return skipOffset != null && skipOffset >= 0;
  }

  getPlayerName(): string {
    return 'THEOplayer';
  }

  getPlayerVersion(): string | undefined {
    return this.player?.version?.version;
  }

  getVersion(): string {
    return `${manifest.version}-react-native-theoplayeradsclass`;
  }

  registerListeners(): void {
    this.references = [
      {
        type: PlayerEventType.AD_EVENT,
        listener: this.onAdEvent.bind(this),
      },
    ];

    for (const reference of this.references) {
      this.player.addEventListener(reference.type, reference.listener);
    }
  }

  unregisterListeners(): void {
    for (const reference of this.references) {
      this.player?.removeEventListener(reference.type, reference.listener);
    }
    this.references = [];
  }

  private onAdEvent(event: AdEvent): void {
    switch (event.subType) {
      case AdEventType.AD_BREAK_BEGIN:
        if (this.isAdBreak(event.ad)) {
          this.currentAdBreak = event.ad;
          this.fireBreakStart();
        }
        break;
      case AdEventType.AD_BEGIN:
        if (this.isAd(event.ad)) {
          this.currentAd = event.ad;
          this.fireStart();
          this.fireJoin();
        }
        break;
      case AdEventType.AD_FIRST_QUARTILE:
        this.fireQuartile(1);
        break;
      case AdEventType.AD_MIDPOINT:
        this.fireQuartile(2);
        break;
      case AdEventType.AD_THIRD_QUARTILE:
        this.fireQuartile(3);
        break;
      case AdEventType.AD_SKIP:
        this.fireSkip();
        break;
      case AdEventType.AD_CLICKED:
        this.fireClick();
        break;
      case AdEventType.AD_END:
        this.fireStop();
        this.currentAd = undefined;
        break;
      case AdEventType.AD_BREAK_END:
        this.fireBreakStop();
        this.currentAdBreak = undefined;
        break;
      case AdEventType.AD_ERROR:
        this.fireError('AD_ERROR', 'NPAW ad error', undefined, undefined, 'onAdError');
        break;
      case AdEventType.AD_BUFFERING:
        // THEOplayer does not provide a reliable matching ad buffer-end event.
        break;
    }
  }

  private isAd(value: Ad | AdBreak): value is Ad {
    return 'adBreak' in value;
  }

  private isAdBreak(value: Ad | AdBreak): value is AdBreak {
    return 'ads' in value || 'timeOffset' in value;
  }
}
