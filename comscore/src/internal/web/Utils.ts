export enum AD_TYPES {
  PREROLL = 'preroll',
  MIDROLL = 'midroll',
  POSTROLL = 'postroll',
}

// https=//docs.portal.theoplayer.com/api-reference/web/theoplayer.playereventmap.md
export enum THEO_EVENTS {
  SOURCE_CHANGE = 'sourcechange',
  ENDED = 'ended',
  LOADED_DATA = 'loadeddata',
  LOADED_METADATA = 'loadedmetadata',
  PLAY = 'play',
  PLAYING = 'playing',
  SEEKING = 'seeking',
  PAUSE = 'pause',
  AD_BEGIN = 'adbegin',
  AD_END = 'adend',
  READY_STATE_CHANGE = 'readystatechange',
  TIME_UPDATE = 'timeupdate',
  RATE_CHANGE = 'ratechange',
  WAITING = 'waiting',
}

export enum READY_STATES {
  HAVE_NOTHING = 0,
  HAVE_METADATA = 1,
  HAVE_CURRENT_DATA = 2,
  HAVE_FUTURE_DATA = 3,
  HAVE_ENOUGH_DATA = 4,
}

export function logDebug(message?: any, ...optionalParams: any[]) {
  if ((window as any).__DEBUG__) {
    console.debug('[COMSCORE]', message, ...optionalParams);
  }
}
