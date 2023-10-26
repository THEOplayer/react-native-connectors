//
//  THEOplayerYouboraOptionsParser.swift
//  react-native-theoplayer-youbora
//
//  Created by Tom Van Laerhoven on 03/07/2023.
//

import Foundation
import YouboraLib

extension YBOptions {
    
    /**
     * YBOptions stores all the Youbora configuration settings.
     * Any value specified in this class, if set, will override the info the plugin is able to get on
     * its own.
     *
     * The only <b>required</b> option is the <accountCode>.
     */
    static func fromDictionary(_ youboraOptions: NSDictionary) ->YBOptions {
        let options = YBOptions.init()
        
        /**
         * If enabled the plugin won't send NQS requests.
         * Default: true
         */
        if let enabled = youboraOptions[YBOptionKeys.enabled] as? Bool {
            options.enabled = enabled
        }
        
        /**
         * Define the security of NQS calls.
         * If true it will use "https://".
         * If false it will use "http://".
         * Default: true
         */
        if let httpSecure = youboraOptions[YBOptionKeys.httpSecure] as? Bool {
            options.httpSecure = httpSecure
        }
        
        /**
         * Host of the Fastdata service.
         */
        if let host = youboraOptions[YBOptionKeys.host] as? String {
            options.host = host
        }
        
        /**
         * NicePeopleAtWork account code that indicates the customer account.
         */
        if let accountCode = youboraOptions[YBOptionKeys.accountCode] as? String {
            options.accountCode = accountCode
        }
        
        /**
         * Optional auth token to validate all the requests
        */
        if let authToken = youboraOptions[YBOptionKeys.authToken] as? String {
            options.authToken = authToken
        }
        
        /**
         * Optional auth type. Used if authToken is set.
         * 'Bearer' by default.
         */
        if let authType = youboraOptions[YBOptionKeys.authType] as? String {
            options.authType = authType
        }
        
        /**
         * User ID value inside your system.
         */
        if let username = youboraOptions[YBOptionKeys.username] as? String {
            options.username = username
        }
        
        /**
         * User type value inside your system.
         */
        if let userType = youboraOptions[YBOptionKeys.userType] as? String {
            options.userType = userType
        }
        
        /**
         * User email
         */
        if let userEmail = youboraOptions[YBOptionKeys.userEmail] as? String {
            options.userEmail = userEmail
        }
        
        /**
         * If true the plugin will parse hls, cdn and location
         * It might slow performance down.
         * Default: false
         */
        if let parseResource = youboraOptions[YBOptionKeys.parseResource] as? Bool {
            options.parseResource = parseResource
        }
        
        /**
         * If parseResource is enabled, it adds extra headers to the request of the content.
         * Use this if for example, the player needs to include authentication headers to
         * request the content, so the plugin needs it to access to the manifest files too.
         */
        if let parseResourceAuth = youboraOptions[YBOptionKeys.parseResourceAuth] as? [String: String] {
            options.parseResourceAuth = parseResourceAuth
        }
        
        /**
         * If defined, resource parse will try to fetch the CDN code from the custom header defined
         * by this property, e.g. "x-cdn-forward"
         */
        if let parseCdnNameHeader = youboraOptions[YBOptionKeys.parseCdnNameHeader] as? String {
            options.parseCdnNameHeader = parseCdnNameHeader
        }
        
        /**
         * If defined, resource parse will try to fetch the CDN code from the custom headers defined
         * by this property, e.g. "@[@"x-cdn-forward"]"
         */
        if let parseCdnNameHeaderList = youboraOptions[YBOptionKeys.parseCdnNameHeaderList] as? NSMutableArray {
            options.parseCdnNameHeaderList = parseCdnNameHeaderList
        }
        
        /**
         * If defined, resource parse will try to fetch the CDN node from the custom header defined
         * by this property, e.g. "x-node"
         */
        if let parseCdnNodeHeader = youboraOptions[YBOptionKeys.parseCdnNodeHeader] as? String {
            options.parseCdnNodeHeader = parseCdnNodeHeader
        }
        
        /**
         * If true the plugin will query the CDN to retrieve the node name.
         * It might slow performance down.
         * Default: false
         */
        if let parseCdnNode = youboraOptions[YBOptionKeys.parseCdnNode] as? Bool {
            options.parseCdnNode = parseCdnNode
        }
        
        /**
         * List of CDN names to parse. This is only used when <parseCdnNode> is enabled.
         * Order is respected when trying to match against a CDN.
         * Default: ["Akamai", "Cloudfront", "Level3", "Fastly", "Highwinds"].
         */
        if let parseCdnNodeList = youboraOptions[YBOptionKeys.parseCdnNodeList] as? NSMutableArray {
            options.parseCdnNodeList = parseCdnNodeList
        }
        
        /**
         * Flag indicating if the cdn parser should search for new cdn
         */
        if let cdnSwitchHeader = youboraOptions[YBOptionKeys.cdnSwitchHeader] as? Bool {
            options.cdnSwitchHeader = cdnSwitchHeader
        }
        
        /**
         Interval of time to search for a new cdn
        */
        if let cdnTTL = youboraOptions[YBOptionKeys.cdnTTL] as? TimeInterval {
            options.cdnTTL = cdnTTL
        }
        
        /**
         * List of experiment ids to use with SmartUsers
         */
        if let experimentIds = youboraOptions[YBOptionKeys.experimentIds] as? NSMutableArray {
            options.experimentIds = experimentIds
        }
        
        /**
         * IP of the viewer/user, e.g. "48.15.16.23".
         */
        if let networkIP = youboraOptions[YBOptionKeys.networkIP] as? String {
            options.networkIP = networkIP
        }
        
        /**
         * Name of the internet service provider of the viewer/user.
         */
        if let networkIsp = youboraOptions[YBOptionKeys.networkIsp] as? String {
            options.networkIsp = networkIsp
        }
        
        /**
         * See a list of codes in <a href="http://mapi.youbora.com:8081/connectionTypes">http://mapi.youbora.com:8081/connectionTypes</a>.
         */
        if let networkConnectionType = youboraOptions[YBOptionKeys.networkConnectionType] as? String {
            options.networkConnectionType = networkConnectionType
        }
        
        /**
         * If the ip address should be obfuscated
         */
        if let userObfuscateIp = youboraOptions[YBOptionKeys.userObfuscateIp] as? NSValue {
            options.userObfuscateIp = userObfuscateIp
        }
        
        /**
         * Youbora's device code. If specified it will rewrite info gotten from user agent.
         * See a list of codes in <a href="http://mapi.youbora.com:8081/devices">http://mapi.youbora.com:8081/devices</a>.
         */
        if let deviceCode = youboraOptions[YBOptionKeys.deviceCode] as? String {
            options.deviceCode = deviceCode
        }
        
        /**
         * Force init enabled
         */
        if let forceInit = youboraOptions[YBOptionKeys.forceInit] as? Bool {
            options.forceInit = forceInit
        }
        
        /**
        * What will be displayed as the device model on Youbora (provided by default with android.os.Build.MODEL if not set)
        */
        if let deviceModel = youboraOptions[YBOptionKeys.deviceModel] as? String {
            options.deviceModel = deviceModel
        }
        
        /**
         * What will be displayed as the device brand on Youbora (provided by default with android.os.Build.BRAND if not set)
         */
        if let deviceBrand = youboraOptions[YBOptionKeys.deviceBrand] as? String {
            options.deviceBrand = deviceBrand
        }
        
        /**
         * What will be displayed as the device type on Youbora (pc, smartphone, stb, tv, etc.)
         */
        if let deviceType = youboraOptions[YBOptionKeys.deviceType] as? String {
            options.deviceType = deviceType
        }
        
        /**
         * What will be displayed as the device name on Youbora (pc, smartphone, stb, tv, etc.)
         */
        if let deviceName = youboraOptions[YBOptionKeys.deviceName] as? String {
            options.deviceName = deviceName
        }
        
        /**
         * OS name that will be displayed on Youbora
         */
        if let deviceOsName = youboraOptions[YBOptionKeys.deviceOsName] as? String {
            options.deviceOsName = deviceOsName
        }
        
        /**
         * OS version that will be displayed on Youbora (provided by default with android.os.Build.VERSION.RELEASE if not set)
         */
        if let deviceOsVersion = youboraOptions[YBOptionKeys.deviceOsVersion] as? String {
            options.deviceOsVersion = deviceOsVersion
        }
        
        /**
         * Option to not send deviceUUID
         */
        if let deviceIsAnonymous = youboraOptions[YBOptionKeys.deviceIsAnonymous] as? Bool {
            options.deviceIsAnonymous = deviceIsAnonymous
        }
        
        /**
         * Option to send a custom deviceUUID
         */
        if let deviceUUID = youboraOptions[YBOptionKeys.deviceUUID] as? String {
            options.deviceUUID = deviceUUID
        }
        
        /**
         * Option to send HDMI EDID value
         */
        if let deviceEDID = youboraOptions[YBOptionKeys.deviceEDID] as? String {
            options.deviceEDID = deviceEDID
        }
        
        /**
         * URL/path of the current media resource.
         */
        if let contentResource = youboraOptions[YBOptionKeys.contentResource] as? String {
            options.contentResource = contentResource
        }
        
        /**
         * @YES if the content is Live. @NO if VOD. Default: nil.
         */
        if let contentIsLive = youboraOptions[YBOptionKeys.contentIsLive] as? NSValue {
            options.contentIsLive = contentIsLive
        }
        
        /**
         * Title of the media.
         */
        if let contentTitle = youboraOptions[YBOptionKeys.contentTitle] as? String {
            options.contentTitle = contentTitle
        }
        
        /**
         * Program title of the media. This could be program name, season, episode, etc.
         */
        if let program = youboraOptions[YBOptionKeys.contentProgram] as? String {
            options.program = program
        }
        
        /**
         * Video segment length in <b>in milliseconds</b>.
         */
        if let contentSegmentDuration = youboraOptions[YBOptionKeys.contentSegmentDuration] as? NSNumber {
            options.contentSegmentDuration = contentSegmentDuration
        }
                
        /**
         * Duration of the media <b>in seconds</b>.
         */
        if let contentDuration = youboraOptions[YBOptionKeys.contentDuration] as? NSNumber {
            options.contentDuration = contentDuration
        }
        
        /**
         * Custom unique code to identify the view.
         */
        if let contentTransactionCode = youboraOptions[YBOptionKeys.contentTransactionCode] as? String {
            options.contentTransactionCode = contentTransactionCode
        }
        
        /**
         * Bitrate of the content in bits per second.
         */
        if let contentBitrate = youboraOptions[YBOptionKeys.contentBitrate] as? NSNumber {
            options.contentBitrate = contentBitrate
        }
        
        /**
         * Total downloaded bytes of the content.
         */
        if let contentTotalBytes = youboraOptions[YBOptionKeys.contentTotalBytes] as? NSNumber {
            options.contentTotalBytes = contentTotalBytes
        }
        
        /**
         * Flag that indicates if the plugin should send total bytes or not
         */
        if let sendTotalBytes = youboraOptions[YBOptionKeys.sendTotalBytes] as? NSNumber {
            options.sendTotalBytes = sendTotalBytes
        }
        
        /**
         * Streaming protocol of the content, you can use any of these YBConstantsStreamProtocol:
         YBConstantsStreamProtocol.hds
         YBConstantsStreamProtocol.hls
         YBConstantsStreamProtocol.mss
         YBConstantsStreamProtocol.dash
         YBConstantsStreamProtocol.rtmp
         YBConstantsStreamProtocol.rtp
         YBConstantsStreamProtocol.rtsp
         YBConstantsStreamProtocol.multicast
         YBConstantsStreamProtocol.dvb
         YBConstantsStreamProtocol.dvbc
         YBConstantsStreamProtocol.dvbt
         YBConstantsStreamProtocol.dvbt2
         */
        if let contentStreamingProtocol = youboraOptions[YBOptionKeys.contentStreamingProtocol] as? String {
            options.contentStreamingProtocol = contentStreamingProtocol
        }
        
        /**
        * Transport format of the content, you can use any of these YBConstantsTransportFormat:
         YBConstantsTransportFormat.hlsTs
         YBConstantsTransportFormat.hlsFmp4
         YBConstantsTransportFormat.hlsCmfv
        */
        if let contentTransportFormat = youboraOptions[YBOptionKeys.contentTransportFormat] as? String {
            options.contentTransportFormat = contentTransportFormat
        }
        
        /**
         * Throughput of the client bandwidth in bits per second.
         */
        if let contentThroughput = youboraOptions[YBOptionKeys.contentThroughput] as? NSNumber {
            options.contentThroughput = contentThroughput
        }
        
        /**
         * Name or value of the current rendition (quality) of the content.
         */
        if let contentRendition = youboraOptions[YBOptionKeys.contentRendition] as? String {
            options.contentRendition = contentRendition
        }

        /**
         * Codename of the CDN where the content is streaming from.
         * See a list of codes in http://mapi.youbora.com:8081/cdns.
         */
        if let contentCdn = youboraOptions[YBOptionKeys.contentCdn] as? String {
            options.contentCdn = contentCdn
        }

        /**
         * String with the CDN node id.
         */
        if let contentCdnNode = youboraOptions[YBOptionKeys.contentCdnNode] as? String {
            options.contentCdnNode = contentCdnNode
        }

        /**
         * String with the CDN node content access type.
         * It defines if the content request hits the cache or not.
         */
        if let contentCdnType = youboraOptions[YBOptionKeys.contentCdnType] as? String {
            options.contentCdnType = contentCdnType
        }

        /**
         * Frames per second of the media being played.
         */
        if let contentFps = youboraOptions[YBOptionKeys.contentFps] as? NSNumber {
            options.contentFps = contentFps
        }

        /**
         * NSDictionary containing mixed extra information about the content like: director, parental rating,
         * device info or the audio channels.
         */
        if let contentMetadata = youboraOptions[YBOptionKeys.contentMetadata] as? [AnyHashable: Any] {
            options.contentMetadata = contentMetadata
        }

        /**
         * NSDictionary containing the content metrics.
         */
        if let contentMetrics = youboraOptions[YBOptionKeys.contentMetrics] as? [AnyHashable: Any] {
            options.contentMetrics = contentMetrics
        }
        
        /**
         * NSDictionary containing the session metrics.
         */
        if let sessionMetrics = youboraOptions[YBOptionKeys.sessionMetrics] as? [AnyHashable: Any] {
            options.sessionMetrics = sessionMetrics
        }

        /**
         * NSValue containing if seeks should be disabled for life content, only applies if content is live, if it's VOD it gets ignored
         */
        if let contentIsLiveNoSeek = youboraOptions[YBOptionKeys.contentIsLiveNoSeek] as? NSValue {
            options.contentIsLiveNoSeek = contentIsLiveNoSeek
        }

        /**
         * NSValue containing if monitor should be disabled for life content, only applies if content is live, if it's VOD it gets ignored. Should be true if the player returns non consistent values for the playhead on live, so playhead monitor wont work to detect buffers and seeks.
         */
        if let contentIsLiveNoMonitor = youboraOptions[YBOptionKeys.contentIsLiveNoMonitor] as? NSValue {
            options.contentIsLiveNoMonitor = contentIsLiveNoMonitor
        }

        /**
         * NSString containing the content package
         */
        if let contentPackage = youboraOptions[YBOptionKeys.contentPackage] as? String {
            options.contentPackage = contentPackage
        }

        /**
         * NSString containing the content saga
         */
        if let contentSaga = youboraOptions[YBOptionKeys.contentSaga] as? String {
            options.contentSaga = contentSaga
        }

        /**
         * NSString containing the content show
         */
        if let contentTvShow = youboraOptions[YBOptionKeys.contentTvShow] as? String {
            options.contentTvShow = contentTvShow
        }

        /**
         * NSString containing the content season
         */
        if let contentSeason = youboraOptions[YBOptionKeys.contentSeason] as? String {
            options.contentSeason = contentSeason
        }

        /**
         * NSString containing the content episode title
         */
        if let contentEpisodeTitle = youboraOptions[YBOptionKeys.contentEpisodeTitle] as? String {
            options.contentEpisodeTitle = contentEpisodeTitle
        }

        /**
         * NSString containing the content channel
         */
        if let contentChannel = youboraOptions[YBOptionKeys.contentChannel] as? String {
            options.contentChannel = contentChannel
        }

        /**
         * NSString containing the content id
         */
        if let contentId = youboraOptions[YBOptionKeys.contentId] as? String {
            options.contentId = contentId
        }

        /**
         * NSString containing the content imdb id
         */
        if let contentImdbId = youboraOptions[YBOptionKeys.contentImdbId] as? String {
            options.contentImdbId = contentImdbId
        }

        /**
         * NSString containing the content gracenote id
         */
        if let contentGracenoteId = youboraOptions[YBOptionKeys.contentGracenoteId] as? String {
            options.contentGracenoteId = contentGracenoteId
        }

        /**
         * NSString containing the content type
         */
        if let contentType = youboraOptions[YBOptionKeys.contentType] as? String {
            options.contentType = contentType
        }

        /**
         * NSString containing the content genre
         */
        if let contentGenre = youboraOptions[YBOptionKeys.contentGenre] as? String {
            options.contentGenre = contentGenre
        }

        /**
         * NSString containing the content language
         */
        if let contentLanguage = youboraOptions[YBOptionKeys.contentLanguage] as? String {
            options.contentLanguage = contentLanguage
        }

        /**
         * NSString containing the content subtitles
         */
        if let contentSubtitles = youboraOptions[YBOptionKeys.contentSubtitles] as? String {
            options.contentSubtitles = contentSubtitles
        }

        /**
         * NSString containing the content contracted resolution
         */
        if let contentContractedResolution = youboraOptions[YBOptionKeys.contentContractedResolution] as? String {
            options.contentContractedResolution = contentContractedResolution
        }

        /**
         * NSString containing the content cost
         */
        if let contentCost = youboraOptions[YBOptionKeys.contentCost] as? String {
            options.contentCost = contentCost
        }

        /**
         * NSString containing the content price
         */
        if let contentPrice = youboraOptions[YBOptionKeys.contentPrice] as? String {
            options.contentPrice = contentPrice
        }

        /**
         * NSString containing the content playback type
         */
        if let contentPlaybackType = youboraOptions[YBOptionKeys.contentPlaybackType] as? String {
            options.contentPlaybackType = contentPlaybackType
        }

        /**
         * NSString containing the content drm
         */
        if let contentDrm = youboraOptions[YBOptionKeys.contentDrm] as? String {
            options.contentDrm = contentDrm
        }

        /**
         * NSString containing the content encoding video codec
         */
        if let contentEncodingVideoCodec = youboraOptions[YBOptionKeys.contentEncodingVideoCodec] as? String {
            options.contentEncodingVideoCodec = contentEncodingVideoCodec
        }

        /**
         * NSString containing the content encoding audio codec
         */
        if let contentEncodingAudioCodec = youboraOptions[YBOptionKeys.contentEncodingAudioCodec] as? String {
            options.contentEncodingAudioCodec = contentEncodingAudioCodec
        }

        /**
         * NSString containing the content encoding codec settings
         */
        if let contentEncodingCodecSettings = youboraOptions[YBOptionKeys.contentEncodingCodecSettings] as? [AnyHashable: Any] {
            options.contentEncodingCodecSettings = contentEncodingCodecSettings
        }

        /**
         * NSString containing the content encoding codec profile
         */
        if let contentEncodingCodecProfile = youboraOptions[YBOptionKeys.contentEncodingCodecProfile] as? String {
            options.contentEncodingCodecProfile = contentEncodingCodecProfile
        }

        /**
         * NSString containing the content encoding container format
         */
        if let contentEncodingContainerFormat = youboraOptions[YBOptionKeys.contentEncodingContainerFormat] as? String {
            options.contentEncodingContainerFormat = contentEncodingContainerFormat
        }
        
        /**
         * NSDictionary containing mixed extra information about the ads like: director, parental rating,
         * device info or the audio channels.
         */
        if let adMetadata = youboraOptions[YBOptionKeys.adMetadata] as? [AnyHashable: Any] {
            options.adMetadata = adMetadata
        }

        /**
         * Variable containing number of ads after stop
         */
        if let adsAfterStop = youboraOptions[YBOptionKeys.adAfterStop] as? NSNumber {
            options.adsAfterStop = adsAfterStop
        }

        /**
         * Variable containing ad campaign
         */
        if let adCampaign = youboraOptions[YBOptionKeys.adCampaign] as? String {
            options.adCampaign = adCampaign
        }

        /**
         * Variable containing ad title
         */
        if let adTitle = youboraOptions[YBOptionKeys.adTitle] as? String {
            options.adTitle = adTitle
        }

        /**
         * Variable containing ad resource
         */
        if let adResource = youboraOptions[YBOptionKeys.adResource] as? String {
            options.adResource = adResource
        }

        /**
         * Variable containing how many ad breaks will be shown for the active view
         */
        if let adGivenBreaks = youboraOptions[YBOptionKeys.adGivenBreaks] as? NSNumber {
            options.adGivenBreaks = adGivenBreaks
        }

        /**
         * Variable containing how many ad breaks should be shown for the active view
         */
        if let adExpectedBreaks = youboraOptions[YBOptionKeys.adExpectedBreaks] as? NSNumber {
            options.adExpectedBreaks = adExpectedBreaks
        }

        /**
         * Variable containing how many ads will be shown for each break
         * Keys must be any of the following YBConstants: YBOPTIONS_AD_POSITION_PRE, YBOPTIONS_AD_POSITION_MID or YBOPTIONS_AD_POSITION_POST
         * Value must be an NSArray containing the number of ads per break (each break is an Array position)
         */
        if let adExpectedPattern = youboraOptions[YBOptionKeys.adExpectedPattern] as? [String: [NSNumber]] {
            options.adExpectedPattern = adExpectedPattern
        }

        /**
         * Variable containing at which moment of the playback a break should be displayed
         */
        if let adBreaksTime = youboraOptions[YBOptionKeys.adBreaksTime] as? [Any] {
            options.adBreaksTime = adBreaksTime
        }

        /**
         * Variable containing how many ads should be played for the current break
         */
        if let adGivenAds = youboraOptions[YBOptionKeys.adGivenAds] as? NSNumber {
            options.adGivenAds = adGivenAds
        }

        /**
         * Variable containing ad creativeId
         */
        if let adCreativeId = youboraOptions[YBOptionKeys.adCreativeId] as? String {
            options.adCreativeId = adCreativeId
        }

        /**
         * Variable containing ad provider
         */
        if let adProvider = youboraOptions[YBOptionKeys.adProvider] as? String {
            options.adProvider = adProvider
        }

        /**
         * If true the plugin will fireStop when going to background
         * Default: true
         */
        if let autoDetectBackground = youboraOptions[YBOptionKeys.background] as? Bool {
            options.autoDetectBackground = autoDetectBackground
        }

        /**
         * @YES if the current view/session could be affected by an ad blocker.
         * @NO if there is no ad blocker.
         * Default: nil.
         */
        if let adBlockerDetected = youboraOptions[YBOptionKeys.adBlockerDetected] as? NSValue {
            options.adBlockerDetected = adBlockerDetected
        }

        /**
         * If true no request will we send and saved for later instead
         */
        if let offline = youboraOptions[YBOptionKeys.offline] as? Bool {
            options.offline = offline
        }

        /**
         * User ID value inside your system for anon users
         */
        if let anonymousUser = youboraOptions[YBOptionKeys.anonymousUser] as? String {
            options.anonymousUser = anonymousUser
        }

        /**
         * Privacy protocol to be used, nil by default.
         * Possible values are "optin" and "optout"
         */
        if let privacyProtocol = youboraOptions[YBOptionKeys.privacyProtocol] as? String {
            options.privacyProtocol = privacyProtocol
        }

        /**
         * Config code for smartswitch
         */
        if let smartswitchConfigCode = youboraOptions[YBOptionKeys.ssConfigCode] as? String {
            options.smartswitchConfigCode = smartswitchConfigCode
        }

        /**
         * Group code for smartswitch
         */
        if let smartswitchGroupCode = youboraOptions[YBOptionKeys.ssGroupCode] as? String {
            options.smartswitchGroupCode = smartswitchGroupCode
        }

        /**
         * Contract code for smartswitch
         */
        if let smartswitchContractCode = youboraOptions[YBOptionKeys.ssContractCode] as? String {
            options.smartswitchContractCode = smartswitchContractCode
        }
        
        /**
         * Content custom dimension 1.
         */
        if let contentCustomDimension1 = youboraOptions[YBOptionKeys.contentCustomDimension1] as? String {
            options.contentCustomDimension1 = contentCustomDimension1
        }

        /**
         * Content custom dimension 2.
         */
        if let contentCustomDimension2 = youboraOptions[YBOptionKeys.contentCustomDimension2] as? String {
            options.contentCustomDimension2 = contentCustomDimension2
        }

        /**
         * Content custom dimension 3.
         */
        if let contentCustomDimension3 = youboraOptions[YBOptionKeys.contentCustomDimension3] as? String {
            options.contentCustomDimension3 = contentCustomDimension3
        }

        /**
         * Content custom dimension 4.
         */
        if let contentCustomDimension4 = youboraOptions[YBOptionKeys.contentCustomDimension4] as? String {
            options.contentCustomDimension4 = contentCustomDimension4
        }

        /**
         * Content custom dimension 5.
         */
        if let contentCustomDimension5 = youboraOptions[YBOptionKeys.contentCustomDimension5] as? String {
            options.contentCustomDimension5 = contentCustomDimension5
        }

        /**
         * Content custom dimension 6.
         */
        if let contentCustomDimension6 = youboraOptions[YBOptionKeys.contentCustomDimension6] as? String {
            options.contentCustomDimension6 = contentCustomDimension6
        }

        /**
         * Content custom dimension 7.
         */
        if let contentCustomDimension7 = youboraOptions[YBOptionKeys.contentCustomDimension7] as? String {
            options.contentCustomDimension7 = contentCustomDimension7
        }

        /**
         * Content custom dimension 8.
         */
        if let contentCustomDimension8 = youboraOptions[YBOptionKeys.contentCustomDimension8] as? String {
            options.contentCustomDimension8 = contentCustomDimension8
        }

        /**
         * Content custom dimension 9.
         */
        if let contentCustomDimension9 = youboraOptions[YBOptionKeys.contentCustomDimension9] as? String {
            options.contentCustomDimension9 = contentCustomDimension9
        }

        /**
         * Content custom dimension 10.
         */
        if let contentCustomDimension10 = youboraOptions[YBOptionKeys.contentCustomDimension10] as? String {
            options.contentCustomDimension10 = contentCustomDimension10
        }

        /**
         * Content custom dimension 11.
         */
        if let contentCustomDimension11 = youboraOptions[YBOptionKeys.contentCustomDimension11] as? String {
            options.contentCustomDimension11 = contentCustomDimension11
        }

        /**
         * Content custom dimension 12.
         */
        if let contentCustomDimension12 = youboraOptions[YBOptionKeys.contentCustomDimension12] as? String {
            options.contentCustomDimension12 = contentCustomDimension12
        }

        /**
         * Content custom dimension 13.
         */
        if let contentCustomDimension13 = youboraOptions[YBOptionKeys.contentCustomDimension13] as? String {
            options.contentCustomDimension13 = contentCustomDimension13
        }

        /**
         * Content custom dimension 14.
         */
        if let contentCustomDimension14 = youboraOptions[YBOptionKeys.contentCustomDimension14] as? String {
            options.contentCustomDimension14 = contentCustomDimension14
        }

        /**
         * Content custom dimension 15.
         */
        if let contentCustomDimension15 = youboraOptions[YBOptionKeys.contentCustomDimension15] as? String {
            options.contentCustomDimension15 = contentCustomDimension15
        }

        /**
         * Content custom dimension 16.
         */
        if let contentCustomDimension16 = youboraOptions[YBOptionKeys.contentCustomDimension16] as? String {
            options.contentCustomDimension16 = contentCustomDimension16
        }

        /**
         * Content custom dimension 17.
         */
        if let contentCustomDimension17 = youboraOptions[YBOptionKeys.contentCustomDimension17] as? String {
            options.contentCustomDimension17 = contentCustomDimension17
        }

        /**
         * Content custom dimension 18.
         */
        if let contentCustomDimension18 = youboraOptions[YBOptionKeys.contentCustomDimension18] as? String {
            options.contentCustomDimension18 = contentCustomDimension18
        }

        /**
         * Content custom dimension 19.
         */
        if let contentCustomDimension19 = youboraOptions[YBOptionKeys.contentCustomDimension19] as? String {
            options.contentCustomDimension19 = contentCustomDimension19
        }

        /**
         * Content custom dimension 20.
         */
        if let contentCustomDimension20 = youboraOptions[YBOptionKeys.contentCustomDimension20] as? String {
            options.contentCustomDimension20 = contentCustomDimension20
        }

        /**
         * Custom dimensions object.
         */
        if let contentCustomDimensions = youboraOptions[YBOptionKeys.contentCustomDimensions] as? [AnyHashable: Any] {
            options.contentCustomDimensions = contentCustomDimensions
        }

        /**
         * Custom ad dimension 1.
         */
        if let adCustomDimension1 = youboraOptions[YBOptionKeys.adCustomDimension1] as? String {
            options.adCustomDimension1 = adCustomDimension1
        }

        /**
         * Custom ad dimension 2.
         */
        if let adCustomDimension2 = youboraOptions[YBOptionKeys.adCustomDimension2] as? String {
            options.adCustomDimension2 = adCustomDimension2
        }

        /**
         * Custom ad dimension 3.
         */
        if let adCustomDimension3 = youboraOptions[YBOptionKeys.adCustomDimension3] as? String {
            options.adCustomDimension3 = adCustomDimension3
        }

        /**
         * Custom ad dimension 4.
         */
        if let adCustomDimension4 = youboraOptions[YBOptionKeys.adCustomDimension4] as? String {
            options.adCustomDimension4 = adCustomDimension4
        }

        /**
         * Custom ad dimension 5.
         */
        if let adCustomDimension5 = youboraOptions[YBOptionKeys.adCustomDimension5] as? String {
            options.adCustomDimension5 = adCustomDimension5
        }

        /**
         * Custom ad dimension 6.
         */
        if let adCustomDimension6 = youboraOptions[YBOptionKeys.adCustomDimension6] as? String {
            options.adCustomDimension6 = adCustomDimension6
        }

        /**
         * Custom ad dimension 7.
         */
        if let adCustomDimension7 = youboraOptions[YBOptionKeys.adCustomDimension7] as? String {
            options.adCustomDimension7 = adCustomDimension7
        }

        /**
         * Custom ad dimension 8.
         */
        if let adCustomDimension8 = youboraOptions[YBOptionKeys.adCustomDimension8] as? String {
            options.adCustomDimension8 = adCustomDimension8
        }

        /**
         * Custom ad dimension 9.
         */
        if let adCustomDimension9 = youboraOptions[YBOptionKeys.adCustomDimension9] as? String {
            options.adCustomDimension9 = adCustomDimension9
        }

        /**
         * Custom ad dimension 10.
         */
        if let adCustomDimension10 = youboraOptions[YBOptionKeys.adCustomDimension10] as? String {
            options.adCustomDimension10 = adCustomDimension10
        }

        /*
         * Name of the app
         */
        if let appName = youboraOptions[YBOptionKeys.appName] as? String {
            options.appName = appName
        }

        /**
         * Release version of the app
         */
        if let appReleaseVersion = youboraOptions[YBOptionKeys.appReleaseVersion] as? String {
            options.appReleaseVersion = appReleaseVersion
        }

        /**
         * Option to send on start events to link views with previous session events
         */
        if let linkedViewId = youboraOptions[YBOptionKeys.linkedViewId] as? String {
            options.linkedViewId = linkedViewId
        }

        /**
         * Enabling this option enables the posibility of getting the /start request later on the view,
         * making the flow go as follows: /init is sent when the player starts to load content,
         * then when the playback starts /joinTime event will be sent, but with the difference of no /start
         * request, instead it will be delayed until all the option keys from <b>pendingMetadata</b>
         * are not <b>null</b>, this is very important, since an empty string is considered a not null
         * and therefore is a valid value.
         */
        if let waitForMetadata = youboraOptions[YBOptionKeys.waitMetadata] as? Bool {
            options.waitForMetadata = waitForMetadata
        }

        /**
         * Set option keys you want to wait for metadata, in order to work <b>waitForMetadata</b>
         * must be set to true.
         * You need to create an <b>NSArray</b> with all the options you want to make the start be hold on.
         * You can find all the keys with the following format:  YBOPTIONS_KEY_{OPTION_NAME} where option
         * name is the same one as the option itself.
         *
         * Find below an example:
         *
         * NSArray *array = @[YBOPTIONS_KEY_CONTENT_TITLE, YBOPTIONS_KEY_CONTENT_CUSTOM_DIMENSION_1]
         * options.pendingMetadata = array
         *
         * The code above prevent the /start request unless <b>contentTItle</b> and <b>contentCustomDimension1</b>
         * stop being nil (you can set a non nil value to any property when information is available).
         */
        if let pendingMetadata = youboraOptions[YBOptionKeys.pendingMetadata] as? [String] {
            options.pendingMetadata = pendingMetadata
        }

        /**
         * The method that will be used for plugin requests.
         * Default: GET
         */
        if let method = youboraOptions[YBOptionKeys.method] as? YBRequestMethod {
            options.method = method
        }
        
        return options
    }
}
