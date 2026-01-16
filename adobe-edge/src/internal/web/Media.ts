/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
/**
 * Internal types not exported by the Adobe SDK.
 */
type AlloyClient = Function;
export default AlloyClient;

export type StreamType = {
  readonly VOD: 'vod';
  readonly Live: 'live';
  readonly Linear: 'linear';
  readonly Podcast: 'podcast';
  readonly Audiobook: 'audiobook';
  readonly AOD: 'aod';
};

export type MediaType = {
  readonly Video: 'video';
  readonly Audio: 'audio';
};

export type MediaTracker = {
  trackSessionStart: (mediaObject: any, contextData?: any) => any;
  trackPlay: () => any;
  trackPause: () => any;
  trackSessionEnd: () => any;
  trackComplete: () => any;
  trackError: (errorId: any) => any;
  trackEvent: (eventType: any, info: any, context: any) => any;
  updatePlayhead: (time: any) => void;
  updateQoEObject: (qoeObject: any) => void;
  destroy: () => void;
};

export type MediaObject =
  | {
      sessionDetails: {
        name: any;
        friendlyName: any;
        length: number;
        streamType: any;
        contentType: any;
      };
    }
  | {
      sessionDetails?: undefined;
    };

export type AdBreakObject =
  | {
      advertisingPodDetails: {
        friendlyName: any;
        offset: any;
        index: any;
      };
    }
  | {
      advertisingPodDetails?: undefined;
    };

export type AdObject =
  | {
      advertisingDetails: {
        friendlyName: any;
        name: any;
        podPosition: any;
        length: any;
      };
    }
  | {
      advertisingDetails?: undefined;
    };

type ChapterObject =
  | {
      chapterDetails: {
        friendlyName: any;
        offset: any;
        index: any;
        length: any;
      };
    }
  | {
      chapterDetails?: undefined;
    };

export type StateObject =
  | {
      name: any;
    }
  | {
      name?: undefined;
    };

export type QoEObject =
  | {
      bitrate: any;
      droppedFrames: any;
      framesPerSecond: any;
      timeToStart: any;
    }
  | {
      bitrate?: undefined;
      droppedFrames?: undefined;
      framesPerSecond?: undefined;
      timeToStart?: undefined;
    };

export type Media = {
  getInstance: () => MediaTracker;
  createMediaObject: (friendlyName: any, name: any, length: any, contentType: any, streamType: any) => MediaObject;
  createAdBreakObject: (name: any, position: any, startTime: any) => AdBreakObject;
  createAdObject: (name: any, id: any, position: any, length: any) => AdObject;
  createChapterObject: (name: any, position: any, length: any, startTime: any) => ChapterObject;
  createStateObject: (stateName: any) => StateObject;
  createQoEObject: (bitrate: any, droppedFrames: any, fps: any, startupTime: any) => QoEObject;

  StreamType: StreamType;
  MediaType: MediaType;
};
