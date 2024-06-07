declare module 'youboralib' {
  import type { THEOplayer } from 'react-native-theoplayer';

  export declare namespace Log {
    export declare class Level {
      public static SILENT: youbora.Log.Level;
      public static ERROR: youbora.Log.Level;
      public static WARNING: youbora.Log.Level;
      public static NOTICE: youbora.Log.Level;
      public static DEBUG: youbora.Log.Level;
      public static VERBOSE: youbora.Log.Level;
    }

    declare let logLevel: Level;
  }

  export declare class Plugin {
    public constructor(options: Options);

    public setAdapter(adapter: Adapter): void;
  }

  export declare class Emitter {}

  /**
   * Main Adapter class. All specific player adapters should extend this class specifying a player
   * class.
   *
   * The Adapter works as the 'glue' between the player and YOUBORA acting both as event
   * translator and as proxy for the {@link Plugin} to get info from the player.
   *
   * @constructs Adapter
   * @extends youbora.Emitter
   * @memberof youbora
   *
   * @param {object|string} player Either an instance of the player or a string containing an ID.
   */
  export declare class Adapter {
    public constructor(player: THEOplayer);

    public player: THEOplayer;

    /**
     * Sets a new player, removes the old listeners if needed.
     *
     * @param {Object} player Player to be registered.
     */
    public setPlayer(player: THEOplayer);

    /**
     * Override to create event binders.
     * It's a good practice when implementing a new Adapter to create intermediate methods and call
     * those when player events are detected instead of just calling the `fire*` methods. This
     * will allow future users of the Adapter to customize its behaviour by overriding these
     * methods.
     *
     * @example
     * registerListeners: function () {
     *  this.player.addEventListener('start', this.onStart.bind(this))
     * },
     *
     * onStart: function (e) {
     *  this.emit('start')
     * }
     */
    public registerListeners();

    /**
     * Override to create event de-binders.
     *
     * @example
     * registerListeners: function () {
     *  this.player.removeEventListener('start', this.onStart)
     * }
     */
    /** Unregister listeners to this.player. */
    public unregisterListeners();

    /**
     * This function disposes the currend adapter, removes player listeners and drops references.
     */
    public dispose();

    /**
     * Creates a new PlayheadMonitor at this.monitor.
     *
     * @param {bool} monitorBuffers If true, it will monitor buffers.
     * @param {bool} monitorSeeks If true, it will monitor seeks.
     * @param {number} [interval=800] The interval time in ms.
     */
    public monitorPlayhead(monitorBuffers: boolean, monitorSeeks: boolean, interval?: number);

    public stopMonitor();

    /**
     *
     * @param {number} [intervalMilliseconds=300]
     */
    public monitorReadyState(intervalMilliseconds: number);

    /**
     * Start ReadyState monitor
     */
    public startReadyStateMonitor();

    /**
     * Stop ReadyState monitor
     */
    public stopReadyStateMonitor();

    /**
     * Check readyState video properties
     * @param readyState
     * @param triggeredEvent
     */
    public checkReadyState(readyState: number, triggeredEvent: string);

    /** Override to return current playhead of the video */
    public getPlayhead(): number | null;

    /** Override to return video duration */
    public getDuration(): number | null;

    /** Override to return current bitrate */
    public getBitrate(): number | null;

    /** Override to return total downloaded bytes */
    public getTotalBytes(): number | null;

    /** Override to return title */
    public getTitle(): string | null;

    /** Override to return resource URL. */
    public getResource(): string | null;

    /** Override to return player version */
    public getPlayerVersion(): string | null;

    /** Override to return player's name */
    public getPlayerName(): string | null;

    /** Override to return adapter version. */
    public getVersion(): string | null;

    /** Override to return video object */
    public getVideoObject(): any | null;

    public getLatency(): number | null;

    // FLOW //

    /**
     * Emits related event and set flags if current status is valid.
     * ie: won't sent init if isStarted is already true.
     *
     * @param {Object} [params] Object of key:value params to add to the request.
     * @param {string} [triggeredEvent]
     */
    public fireInit(params: object, triggeredEvent: string);

    /**
     * Emits related event and set flags if current status is valid.
     * ie: won't sent start if isStarted is already true.
     *
     * @param {Object} [params] Object of key:value params to add to the request.
     * @param {string} [triggeredEvent]
     */
    fireStart(params: object, triggeredEvent: string);

    /**
     * Emits related event and set flags if current status is valid.
     * ie: won't sent start if isStarted is already true.
     *
     * @param {Object} [params] Object of key:value params to add to the request.
     * @param {string} [triggeredEvent]
     */
    fireJoin(params: object, triggeredEvent: string);

    /**
     * Emits related event and set flags if current status is valid.
     * ie: won't sent start if isStarted is already true.
     *
     * @param {Object} [params] Object of key:value params to add to the request.
     * @param {string} [triggeredEvent]
     */
    firePause(params: object, triggeredEvent: string);

    /**
     * Emits related event and set flags if current status is valid.
     * ie: won't sent start if isStarted is already true.
     *
     * @param {Object} [params] Object of key:value params to add to the request.
     * @param {string} [triggeredEvent]
     */
    fireResume(params: object, triggeredEvent: string);

    /**
     * Emits related event and set flags if current status is valid.
     * ie: won't sent start if isStarted is already true.
     *
     * @param {Object} [params] Object of key:value params to add to the request.
     * @param {boolean} [convertFromSeek=false] If true, will convert current seek to buffer.
     * @param {string} [triggeredEvent]
     * @param {boolean} [triggeredByStateProperty]
     */
    fireBufferBegin(params: object, convertFromSeek: boolean, triggeredEvent: string, triggeredByStateProperty: boolean);

    /**
     * Emits related event and set flags if current status is valid.
     * ie: won't sent start if isStarted is already true.
     *
     * @param {Object} [params] Object of key:value params to add to the request.
     * @param {string} [triggeredEvent]
     */
    fireBufferEnd(params: object, triggeredEvent: string);
  }

  export declare let adapters: any;

  export declare interface Options {
    /** @prop {boolean} [enabled=true] If false, the plugin won't send NQS requests. */
    enabled?: boolean;

    /** @prop {string} [host='a-fds.youborafds01.com'] Host of the Fastdata service. */
    host?: string;

    /**
     * @prop {string} [accountCode='nicetest']
     * NicePeopleAtWork account code that indicates the customer account.
     */
    accountCode?: string;

    /**
     * @prop {string} [authToken]
     * Optional auth token to validate all the requests
     */
    authToken?: string;

    /**
     * @prop {string} [authType]
     * Optional auth type. Used if authToken is set.
     * 'Bearer' by default.
     */
    authType?: string;

    /**
     *  @prop {boolean} [preventZombieViews=true]
     * If true, the plugin will check if the last event
     * was sent more than 10 mins ago
     * so it will not send more events to the same view
     */
    preventZombieViews?: boolean;

    /**
     * @prop {boolean} [offline=false]
     * If true the plugin will store the events and send them later when there's connection
     */
    offline?: boolean;

    /** @prop {string} [referer] Site url.
     *  By default window.location.href */
    referer?: string;

    /** @prop {string} [referral] Previous site url.
     *  By default document.referrer */
    referral?: string;

    /**
     * @prop {boolean} [disableCookies]
     * To disable cookies storage fallback after local/sessionstorage
     * True by default
     */
    disableCookies?: boolean;

    /**
     * @prop {boolean} [forceCookies]
     * To force the use of cookies storage instead of local/sessionstorage
     * False by default
     */
    forceCookies?: boolean;

    /**
     * @prop {boolean} [disableStorage]
     * To disable all possible storages usage (cookies, localStorage, sessionStorage)
     * CAUTION: enabling  option session tracking may stop to work properly
     * False by default
     */
    disableStorage?: boolean;

    // USER

    /**
     * @prop {string} [user.email]
     * User email.
     */
    ['user.email']?: string;

    /**
     * @prop {string} [user.type]
     * User type.
     */
    ['user.type']?: string;

    /**
     * @prop {string} [user.name]
     * User ID value inside your system.
     */
    ['user.name']?: string;

    /**
     *  @prop {boolean} [user.obfuscateIp=false]
     * If true, the view will have the IP obfuscated
     */
    ['user.obfuscateIp']?: boolean;

    /**
     * @prop {string} [user.anonymousId]
     * Anonymous identifyer of the user provided by the customer.
     */
    ['user.anonymousId']?: string;

    /**
     * @prop {string} [user.privacyProtocol]
     * Privacy protocol to be used, nothing by default.
     * Possible values are "optin" and "optout"
     */
    ['user.privacyProtocol']?: string;

    // PARSERS

    /**
     * @prop {boolean} [parse.manifest=false]
     * If true the plugin will look for location value in manifest header to retrieve the actual resource,
     * will parse HLS files to use the first .ts file found as resource and
     * will look for location and segment values inside DASH manifest to retrieve the actual resource
     * It might slow performance down.
     */
    ['parse.manifest']?: boolean;

    /**
     * @prop {object} [parse.manifest.auth={}]
     * If parse.manifest enabled, it adds extra headers to the request of the content.
     * Use  if for example, the player needs to include authentication headers to request the content,
     * so the plugin needs it to access to the manifest files too.
     */
    ['parse.manifest.auth']?: object;

    /**
     * @prop {array<string>} [parse.CdnNameHeader]
     * If defined, resource parse will try to fetch the CDN code from the custom header defined
     * by  property. ie: '[x-cdn-forward]'
     */
    ['parse.cdnNameHeader']?: string;

    /**
     * @prop {string} [parse.CdnNodeHeader]
     * If defined, resource parse will try to fetch the CDN node name from the custom header defined
     * by  property. ie: 'x-node'
     */
    ['parse.cdnNodeHeader']?: string;

    /**
     * @prop {boolean} [parse.CdnNode=false]
     * If true the plugin will query the CDN to retrieve the node name.
     * It might slow performance down.
     */
    ['parse.cdnNode']?: boolean;

    /**
     * @prop {array<string>} [parse.CdnNode.list=false]
     * If true the plugin will query the CDN to retrieve the node name.
     * It might slow performance down.
     */
    ['parse.cdnNode.list']?: string[];

    /**
     * @prop {function} [parse.fdsResponseHost=null]
     * Parses fastdata response to modify the host where the requests will be sent
     */
    ['parse.fdsResponseHost']?: () => void;

    /**
     * @prop {function} [parse.cdnSwitchHeader=false]
     * Parses a video chunk or manifest every x seconds to read the x-cdn header and report it
     */
    ['parse.cdnSwitchHeader']?: boolean;

    /**
     * @prop {function} [parse.cdnTTL=60]
     * if parse.cdnSwitchHeader enabled, the time between new requests
     */
    ['parse.cdnTTL']?: number;

    // NETWORK

    /** @prop {string} [network.ip] IP of the viewer/user. ie= '100.100.100.100'. */
    ['network.ip']?: string;

    /** @prop {string} [network.isp] Name of the internet service provider of the viewer/user. */
    ['network.isp']?: string;

    /**
     * @prop {string} [network.connectionType]
     * Type of connection used
     */
    ['network.connectionType']?: string;

    // DEVICE

    /**
     * @prop {string} [device.id]
     * Unique identifyer of the device. If set it will consider the value as the device id.
     * By default the plugin tries to generate a unique id based on exposed information on the browser.
     * It wont be sent if 'device.isAnonymous option' is set to true.
     */
    ['device.id']?: string;

    /**
     * @prop {string} [device.code]
     * Youbora's device code. If specified it will rewrite info gotten from user agent.
     * See a list of codes in {@link http://mapi.youbora.com:8081/devices}
     */
    ['device.code']?: string;

    /**
     * @prop {string} [device.model]
     * Device model name
     */
    ['device.model']?: string;

    /**
     * @prop {string} [device.brand]
     * Device vendor name
     */
    ['device.brand']?: string;

    /**
     * @prop {string} [device.type]
     * Device type (pc, smartphone, stb, tv, etc.)
     */
    ['device.type']?: string;

    /**
     * @prop {string} [device.name]
     * Device name. It must exist in NPAW database.
     */
    ['device.name']?: string;

    /**
     * @prop {string} [device.osName]
     * OS name.
     */
    ['device.osName']?: string;

    /**
     * @prop {string} [device.osVersion]
     * OS version.
     */
    ['device.osVersion']?: string;

    /**
     * @prop {string} [device.browserName]
     * Browser name.
     */
    ['device.browserName']?: string;

    /**
     * @prop {string} [device.browserVersion]
     * Browser version.
     */
    ['device.browserVersion']?: string;

    /**
     * @prop {string} [device.browserType]
     * Browser type.
     */
    ['device.browserType']?: string;

    /**
     * @prop {string} [device.browserEngine]
     * Browser engine.
     */
    ['device.browserEngine']?: string;

    /**
     * @prop {string} [device.EDID]
     * Connected screen EDID.
     * The expected format is a hex value
     */
    ['device.EDID']?: string;

    /**
     * @prop {bool} [device.isAnonymous]
     * If true, it blocks 'deviceUUID' parameter in requests.
     */
    ['device.isAnonymous']?: boolean;

    // CONTENT

    /** @prop {string} [content.transactionCode] Custom unique code to identify the view. */
    ['content.transactionCode']?: string;

    /** @prop {string} [content.resource] URL/path of the current media resource. */
    ['content.resource']?: string;

    /** @prop {boolean} [content.isLive] True if the content is live false if VOD. */
    ['content.isLive']?: boolean;

    /** @prop {boolean} [content.isLive.noSeek] True if the player seeks automatically when resumed or ending buffer. Only for live content. False by default */
    ['content.isLive.noSeek']?: boolean;

    /** @prop {boolean} [content.isLive.noMonitor] True if the player returns non consistent values for the playhead on live, so playhead monitor wont work to detect buffers and seeks. False by default. */
    ['content.isLive.noMonitor']?: boolean;

    /** @prop {string} [content.title] Title of the media. */
    ['content.title']?: string;

    /** @prop {string} [content.program] Secondary title of the media */
    ['content.program']?: string;

    /** @prop {number} [content.duration] Duration of the media. */
    ['content.duration']?: number;

    /** @prop {number} [content.fps] Frames per second of the content in the current moment. */
    ['content.fps']?: number;

    /** @prop {number} [content.segmentDuration] Video segment length in milliseconds. */
    ['content.segmentDuration']?: number;

    /** @prop {number} [content.bitrate] Bitrate of the content in bits per second. */
    ['content.bitrate']?: number;

    /** @prop {number} [content.totalBytes] Total downloaded bytes of the content. */
    ['content.totalBytes']?: number;

    /** @prop {bool} [content.sendTotalBytes] Additionaly report totalbytes or not, default false. */
    ['content.sendTotalBytes']?: boolean;

    /** @prop {number} [content.throughput] Throughput of the client bandwith in bits per second. */
    ['content.throughput']?: number;

    /** @prop {string} [content.rendition] Name of the current rendition of the content. */
    ['content.rendition']?: string;

    /**
     * @prop {string} [content.cdn]
     * Codename of the CDN where the content is streaming from.
     * See a list of codes in {@link http://mapi.youbora.com:8081/cdns}
     * */
    ['content.cdn']?: string;

    /** @prop {string} [content.cdnNode] CDN node id */
    ['content.cdnNode']?: string;

    /**
     * @prop {number} [content.cdnType] CDN node content access type
     * It defines if the content request hits the cache or not
     * TCP_HIT / HIT: 1
     * TCP_MISS / MISS: 2
     * TCP_MEM_HIT: 3
     * TCP_IMS_HIT: 4
     */
    ['content.cdnType']?: number;

    /**
     * @prop {object} [content.metadata]
     * Item containing mixed extra information about the content like: director, parental rating,
     * device info or the audio channels. object may store any serializable key:value info.
     */
    ['content.metadata']?: object;

    /**
     * @prop {object} [content.metrics]
     * Item containing metrics in json format. Reported every ping if the values change
     */
    ['content.metrics']?: object;

    /** @prop {string} [content.streamingProtocol] Name of the streaming media protocol.
     * Can be:
     *   - HDS (Adobe HDS)
     *   - HLS (Apple HLS)
     *   - MSS (Microsoft Smooth Streaming)
     *   - DASH (MPEG-DASH)
     *   - RTMP (Adobe RTMP)
     *   - RTP (RTP)
     *   - RTSP (RTSP)
     *   - MULTICAST (Multicast)
     *   - DVB (DVB)
     *   - DVBC (DVB-C)
     *   - DVBT (DVB-T)
     *   - DVBT2 (DVB-T2)
     */
    ['content.streamingProtocol']?: string;

    /** @prop {string} [content.transportFormat] Name of the transport format.
     * Can be:
     *   - TS (MPEG-2 TS)
     *   - MP4 (Fragmented MP4)
     */
    ['content.transportFormat']?: string;

    /** @prop {number} [content.package] Package of the media. */
    ['content.package']?: string;

    /** @prop {number} [content.saga] Saga of the media. */
    ['content.saga']?: string;

    /** @prop {number} [content.tvShow] TV Show of the media. */
    ['content.tvShow']?: string;

    /** @prop {number} [content.season] Season of the media. */
    ['content.season']?: string;

    /** @prop {number} [content.episodeTitle] Episode title of the media. */
    ['content.episodeTitle']?: string;

    /** @prop {number} [content.channel] Channel name of the media. */
    ['content.channel']?: string;

    /** @prop {number} [content.id] ID of the media. */
    ['content.id']?: string;

    /** @prop {number} [content.imdbId] IMDB id of the media. */
    ['content.imdbId']?: string;

    /** @prop {number} [content.gracenoteId] Gracenote id of the media. */
    ['content.gracenoteId']?: string;

    /** @prop {number} [content.type] Type of the media. */
    ['content.type']?: string;

    /** @prop {number} [content.genre] Genre of the media. */
    ['content.genre']?: string;

    /** @prop {number} [content.language] Language of the media. */
    ['content.language']?: string;

    /** @prop {boolean} [content.autodetect.language] Auto detect change languages value. */
    ['content.autodetect.language']?: boolean;

    /** @prop {number} [content.subtitles] Subtitles of the media. */
    ['content.subtitles']?: string;

    /** @prop {boolean} [content.autodetect.subtitles] Auto detect change subtitles value. */
    ['content.autodetect.subtitles']?: boolean;

    /** @prop {number} [content.contractedResolution] Contracted Resolution of the media. */
    ['content.contractedResolution']?: number;

    /** @prop {number} [content.cost] Cost of the media. */
    ['content.cost']?: number;

    /** @prop {number} [content.price] Price of the media. */
    ['content.price']?: number;

    /** @prop {number} [content.playbackType] Type of the media. Can be Vod, Live, catch-up or offline */
    ['content.playbackType']?: string;

    /** @prop {number} [content.drm] DRM of the media. */
    ['content.drm']?: string;

    // Encoding

    /** @prop {number} [content.encoding.videoCodec] Video codec of the media. */
    ['content.encoding.videoCodec']?: string;

    /** @prop {number} [content.encoding.audioCodec] Audio codec of the media. */
    ['content.encoding.audioCodec']?: string;

    /** @prop {number} [content.encoding.codecSettings] Codec settings of the media. */
    ['content.encoding.codecSettings']?: string;

    /** @prop {number} [content.encoding.codecProfile] Codec profile of the media. */
    ['content.encoding.codecProfile']?: string;

    /** @prop {number} [content.encoding.containerFormat] Container format of the media. */
    ['content.encoding.containerFormat']?: string;

    // ADS

    /**
     * @prop {object} [ad.metadata]
     * Item containing mixed extra information about ads like: request url.
     *  object may store any serializable key:value info.
     */
    ['ad.metadata']?: object;

    /**
     * @prop {string} [ad.campaign]
     * String containing the name of the campaign
     */
    ['ad.campaign']?: string;

    /**
     * @prop {string} [ad.creativeId]
     * String containing the id of the creative
     */
    ['ad.creativeId']?: string;

    /**
     * @prop {string} [ad.provider]
     * String containing the provider of the ad
     */
    ['ad.provider']?: string;

    /**
     * @prop {string} [ad.resource]
     * String containing the ad resource
     */
    ['ad.resource']?: string;

    /**
     * @prop {string} [ad.title]
     * String containing the title of the campaign
     */
    ['ad.title']?: string;

    /**
     * @prop {duration} [ad.duration]
     * Duration of the ad in seconds
     */
    ['ad.duration']?: string;

    /**
     * @prop {object} [ad.expectedPattern]
     * Json with the position of the breaks expected.
     * Arrays are the number of breaks, and the numbers in them, the number of ads for each break
     *
     * Example:
     * {pre: [1],
     * mid: [1,2],
     * post: [1]}
     * Would be a view with 1 preroll break with 1 ad, 2 midroll breaks, one with 1 ad and
     * the other with 2, and one postroll break with 1 ad.
     */
    ['ad.expectedPattern']?: object;

    /**
     * @prop {string} [ad.givenAds]
     * Number of ads given by the adserver for  break
     */
    ['ad.givenAds']?: number;

    /**
     * @prop {number[]} [ad.breaksTime]
     * Array of numbers for the time position of adbreaks
     */
    ['ad.breaksTime']?: number[];

    /**
     * @prop {string} [ad.expectedBreaks]
     * Number of breaks expected for the view
     */
    ['ad.expectedBreaks']?: number;

    /**
     * @prop {number} [ad.givenBreaks]
     * Number of breaks given by the adserver for the view
     */
    ['ad.givenBreaks']?: number;

    /**
     * @prop {boolean} [ad.ignore]
     * False by default.
     * If true, youbora blocks ad events and calculates jointime ignoring ad time.
     */
    ['ad.ignore']?: boolean;

    /**
     * @prop {boolean} [ad.blockerDetected]
     * Null (notified as false) by default.
     * Sets if an adblocker has been detected
     */
    ['ad.blockerDetected']?: boolean;

    // APP

    /**
     * @prop {string} [app.name]
     * String containing the name of the app
     */
    ['app.name']?: string;

    /**
     * @prop {string} [app.releaseVerson]
     * String containing the app version
     */
    ['app.releaseVersion']?: string;

    /**
     * @prop {boolean} [app.https=null]
     * Define the security of NQS calls.
     * If true it will use 'https://',
     * if false it will use 'http://',
     * if null/undefined it will use '//'.
     */
    ['app.https']?: boolean;

    // BACKGROUND

    /**
     *  @prop {boolean} [background.enabled=false]
     * If true, plugin will send background/foreground events
     * Different device behaviour is settable in background.settings
     */
    ['background.enabled']?: boolean;

    /**
     *  @prop {string} [background.settings]
     * Action to do when the browser goes to background.
     * Options are 'stop', 'pause', and '' for no action.
     * stop will be used to stop the view and track post-foreground events in a new view
     * pause will be used when after foreground event, an action like pressing play button is expected to resume the content
     * '' will be used if the content can be played in background
     * If not defined, specific device options will be used
     * background.setings.android / background.settings.iOS / background.settings.desktop / background.settings.tv
     * Default specific device values are stop for android and iphone, nothing for desktop.
     */
    ['background.settings']?: string;

    /**
     *  @prop {string} [background.settings.android='stop']
     * If background.settings is not defined, action to do when the browser goes to background if
     * the device is android type.
     * Options are 'stop', 'pause', and '' or not defined for no action.
     * bg by default
     */
    ['background.settings.android']?: string;

    /**
     *  @prop {string} [background.settings.iOS='stop']
     * If background.settings is not defined, action to do when the browser goes to background if
     * the device is iphone type.
     * Options are 'stop', 'pause', and '' or not defined for no action.
     * bg by default
     */
    ['background.settings.iOS']?: string;

    /**
     *  @prop {string} [background.settings.desktop=null]
     * If background.settings is not defined, action to do when the browser goes to background if
     * the device is desktop type.
     * Options are 'stop', 'pause', and '' or not defined for no action.
     * Null by default
     */
    ['background.settings.desktop']?: string;

    /**
     *  @prop {string} [background.settings.tv='stop']
     * If background.settings is not defined, action to do when the browser goes to background if
     * the device is smartTV type.
     * Options are 'stop', 'pause', and '' or not defined for no action.
     * bg by default
     */
    ['background.settings.tv']?: string;

    /**
     *  @prop {string} [background.settings.playstation='stop']
     * If background.settings is not defined, action to do when the browser goes to background if
     * the device is playstation type.
     * Options are 'stop', 'pause', and '' or not defined for no action.
     * Null by default
     */
    ['background.settings.playstation']?: string;

    // SMARTSWITCH

    /**
     *  @prop {string} [smartswitch.configCode]
     * Config code for smartswitch
     * null by default
     */
    ['smartswitch.configCode']?: string;

    /**
     *  @prop {string} [smartswitch.groupCode]
     * Group code for smartswitch
     * null by default
     */
    ['smartswitch.groupCode']?: string;

    /**
     *  @prop {string} [smartswitch.contractCode]
     * Contract code for smartswitch
     * null by default
     */
    ['smartswitch.contractCode']?: string;

    // EXTRAPARAMS // CUSTOM DIMENSIONS

    /** @prop {object} [content.customDimensions] Custom dimensions object. */
    ['content.customDimensions']?: object;

    /** @prop {string} [content.customDimension.1] Custom parameter 1. */
    ['content.customDimension.1']?: string;

    /** @prop {string} [content.customDimension.2] Custom parameter 2. */
    ['content.customDimension.2']?: string;

    /** @prop {string} [content.customDimension.3] Custom parameter 3. */
    ['content.customDimension.3']?: string;

    /** @prop {string} [content.customDimension.4] Custom parameter 4. */
    ['content.customDimension.4']?: string;

    /** @prop {string} [content.customDimension.5] Custom parameter 5. */
    ['content.customDimension.5']?: string;

    /** @prop {string} [content.customDimension.6] Custom parameter 6. */
    ['content.customDimension.6']?: string;

    /** @prop {string} [content.customDimension.7] Custom parameter 7. */
    ['content.customDimension.7']?: string;

    /** @prop {string} [content.customDimension.8] Custom parameter 8. */
    ['content.customDimension.8']?: string;

    /** @prop {string} [content.customDimension.9] Custom parameter 9. */
    ['content.customDimension.9']?: string;

    /** @prop {string} [content.customDimension.10] Custom parameter 10. */
    ['content.customDimension.10']?: string;

    /** @prop {string} [content.customDimension.11] Custom parameter 11. */
    ['content.customDimension.11']?: string;

    /** @prop {string} [content.customDimension.12] Custom parameter 12. */
    ['content.customDimension.12']?: string;

    /** @prop {string} [content.customDimension.13] Custom parameter 13. */
    ['content.customDimension.13']?: string;

    /** @prop {string} [content.customDimension.14] Custom parameter 14. */
    ['content.customDimension.14']?: string;

    /** @prop {string} [content.customDimension.15] Custom parameter 15. */
    ['content.customDimension.15']?: string;

    /** @prop {string} [content.customDimension.16] Custom parameter 16. */
    ['content.customDimension.16']?: string;

    /** @prop {string} [content.customDimension.17] Custom parameter 17. */
    ['content.customDimension.17']?: string;

    /** @prop {string} [content.customDimension.18] Custom parameter 18. */
    ['content.customDimension.18']?: string;

    /** @prop {string} [content.customDimension.19] Custom parameter 19. */
    ['content.customDimension.19']?: string;

    /** @prop {string} [content.customDimension.20] Custom parameter 20. */
    ['content.customDimension.20']?: string;

    /** @prop {string} [ad.customDimension.1] Ad custom parameter 1. */
    ['ad.customDimension.1']?: string;

    /** @prop {string} [ad.customDimension.2] Ad custom parameter 2. */
    ['ad.customDimension.2']?: string;

    /** @prop {string} [ad.customDimension.3] Ad custom parameter 3. */
    ['ad.customDimension.3']?: string;

    /** @prop {string} [ad.customDimension.4] Ad custom parameter 4. */
    ['ad.customDimension.4']?: string;

    /** @prop {string} [ad.customDimension.5] Ad custom parameter 5. */
    ['ad.customDimension.5']?: string;

    /** @prop {string} [ad.customDimension.6] Ad custom parameter 6. */
    ['ad.customDimension.6']?: string;

    /** @prop {string} [ad.customDimension.7] Ad custom parameter 7. */
    ['ad.customDimension.7']?: string;

    /** @prop {string} [ad.customDimension.8] Ad custom parameter 8. */
    ['ad.customDimension.8']?: string;

    /** @prop {string} [ad.customDimension.9] Ad custom parameter 9. */
    ['ad.customDimension.9']?: string;

    /** @prop {string} [ad.customDimension.10] Ad custom parameter 10. */
    ['ad.customDimension.10']?: string;

    /** @prop {bool} [forceInit] Forces init to be sent instead of start, use it when mediaduration,
     *  title, source or is live is reported with a wrong value by the player until jointime happens */
    forceInit?: boolean;

    /**
     * @prop {object} [session.metrics]
     * Item containing metrics in json format. Reported every beat if the values change
     */
    ['session.metrics']?: object;

    /**
     * @prop {bool} [session.context]
     * Boolean to choose to report context or not. False by default
     */
    ['session.context']?: boolean;

    /**
     * @prop {array<string>} [errors.fatal=[]]
     * If it has elements on it, all the errors matching  code will fire the stop event to end the view
     */
    ['errors.fatal']?: string[];

    /**
     * @prop {array<string>} [errors.nonFatal=[]]
     * If it has elements on it, all the errors matching  code won't fire a stop event to end the view
     */
    ['errors.nonFatal']?: string[];

    /**
     * @prop {array<string>} [errors.ignore=[]]
     * If it has elements on it, all the errors matching  code wont be reported
     */
    ['errors.ignore']?: string[];

    /**
     * @prop {string} linkedViewId
     * String to send on start events to link views with previous session events
     */
    linkedViewId?: string;

    /**
     * @prop {bool} [waitForMetadata]
     * Boolean to delay the start event. Use with `pendingMetadata`
     */
    waitForMetadata?: boolean;

    /**
     * @prop {array<string>} [pendingMetadata]
     * List of values that should be ready to send in start event. Use with `waitForMetadata` set to True.
     */
    pendingMetadata?: string[];

    /**
     * @prop {string} method
     * Method used to send request to backend side
     *  Options are 'get' or 'post'
     *  'get' by default
     */
    method?: string;

    /**
     * @prop {bool} [playhead.monitor]
     * Method to enabled/disable support for playhead monitor method
     */
    ['playhead.monitor']?: boolean;

    /**
     * @prop {bool} [network.monitor]
     * Method to enabled/disable support for readyState monitor method
     */
    ['readyState.monitor']?: boolean;
  }
}
