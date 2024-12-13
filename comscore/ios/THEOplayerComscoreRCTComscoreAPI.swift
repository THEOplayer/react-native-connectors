
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerConnectorComscore
import THEOplayerSDK

@objc(THEOplayerComscoreRCTComscoreAPI)
class THEOplayerComscoreRCTComscoreAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    var connectors = [NSNumber: ComscoreConnector]()

    static func moduleName() -> String! {
        return "ComscoreModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(initialize:ComscoreMetadata:ComscoreConfig:)
    func initialize(_ node: NSNumber, ComscoreMetadata: NSDictionary, ComscoreConfig: NSDictionary) -> Void {
        print("[ComscoreModule] initialize triggered.")

        DispatchQueue.main.async {
            print("[ComscoreModule]", ComscoreConfig)
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player {
                let configuration = ComScoreConfiguration(
                    publisherId: ComscoreConfig["publisherId"] as! String,
                    applicationName: ComscoreConfig["applicationName"] as! String,
                    userConsent: self.mapUserConsent(userConsent: ComscoreConfig["userConsent"] as! String),
                    usagePropertiesAutoUpdateMode: self.mapUsagePropertiesAutoUpdateMode(usagePropertiesAutoUpdateMode: ComscoreConfig["usagePropertiesAutoUpdateMode"] as? String ?? "foregroundOnly"),
                    adIdProcessor: nil,
                    debug: ComscoreConfig["debug"] as! Bool
                )
                let connector = ComscoreConnector(
                    configuration: configuration,
                    player: player,
                    metadata: ComScoreMetadata(
                        mediaType: .shortFormOnDemand,
                        uniqueId: ComscoreMetadata["uniqueId"] as! String,
                        length: Int(truncating: ComscoreMetadata["length"] as! NSNumber),
                        stationTitle: ComscoreMetadata["stationTitle"] as! String,
                        programTitle: ComscoreMetadata["programTitle"] as! String,
                        episodeTitle: ComscoreMetadata["episodeTitle"] as! String ,
                        genreName: ComscoreMetadata["genreName"] as! String,
                        classifyAsAudioStream: (ComscoreMetadata["classifyAsAudioStream"] as! Bool))
                )
                self.connectors[node] = connector
                print("[ComscoreModule] added connector to view", node)
            }
        }
    }

    @objc(update:metadata:)
    func update(_ node: NSNumber, metadata: NSDictionary) -> Void {
        print("[ComscoreModule] update triggered.")
        DispatchQueue.main.async {
            if let connector = self.connectors[node], let contentMetadata = metadata as? [String: Any] {
                let comscoreMetadata: ComScoreMetadata = self.toComScoreMetadata(metadata:contentMetadata)
                connector.streamingAnalytics.update(metadata: comscoreMetadata)
            }
        }
    }
    
    @objc(setPersistentLabel:label:value:)
    func setPersistentLabel(_ node: NSNumber, label: NSString, value: NSString) -> Void {
        print("[ComscoreModule] setPersistentLabel triggered.")
        DispatchQueue.main.async {
            if let connector = self.connectors[node] {
                connector.streamingAnalytics.setPersistentLabel(label: label as String, value: value as String)
            }
        }
    }
    
    @objc(setPersistentLabels:labels:)
    func setPersistentLabels(_ node: NSNumber, labels: NSDictionary) -> Void {
        print("[ComscoreModule] setPersistentLabels triggered.")
        DispatchQueue.main.async {
            if let connector = self.connectors[node], let labelsDictionary =  labels as? [String:String] {
                connector.streamingAnalytics.setPersistentLabels(labels: labelsDictionary)
            }
        }
    }

    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        print("[ComscoreModule] destroy triggered.")
        DispatchQueue.main.async {
            self.connectors[node]?.streamingAnalytics.destroy()
            self.connectors.removeValue(forKey: node)
        }
    }
    
    func toComScoreMetadata(metadata: [String: Any]) -> ComScoreMetadata {
        // TODO implement mapping
        // Return dummy to prevent compiler errors
        let comscoreMetadata = ComScoreMetadata(
            mediaType: mapMediaType(mediaType: metadata["mediaType"] as! String),
            uniqueId: metadata["uniqueId"] as! String,
            length: Int(truncating: metadata["length"] as! NSNumber),
            c3: metadata["c3"] as? String,
            c4: metadata["c4"] as? String,
            c6: metadata["c6"] as? String,
            stationTitle: metadata["stationTitle"] as! String,
            stationCode: metadata["stationCode"] as? String,
            networkAffiliate: metadata["networkAffiliate"] as? String,
            publisherName: metadata["publisherName"] as? String,
            programTitle: metadata["programTitle"] as! String,
            programId: metadata["programId"] as? String,
            episodeTitle: metadata["episodeTitle"] as! String,
            episodeId: metadata["episodeId"] as? String,
            episodeSeasonNumber: metadata["episodeSeasonNumber"] as? String,
            episodeNumber: metadata["episodeNumber"] as? String,
            genreName: metadata["genreName"] as! String,
            genreId: metadata["genreId"] as? String,
            carryTvAdvertisementLoad: metadata["carryTvAdvertisementLoad"] as? Bool,
            classifyAsCompleteEpisode: metadata["classifyAsCompleteEpisode"] as? Bool,
            productionDate: mapDate(date: metadata["productionDate"] as? [String:NSNumber] ?? [:]),
            productionTime: mapTime(time: metadata["productionTime"] as? [String:NSNumber] ?? [:]),
            tvAirDate: mapDate(date: metadata["tvAirDate"] as? [String:NSNumber] ?? [:]),
            tvAirTime: mapTime(time: metadata["tvAirTime"] as? [String:NSNumber] ?? [:]),
            digitalAirDate: mapDate(date: metadata["digitalAirDate"] as? [String:NSNumber] ?? [:]),
            digitalAirTime: mapTime(time: metadata["digitalAirTime"] as? [String:NSNumber] ?? [:]),
            feedType: mapFeedType(feedType: metadata["feedType"] as? String),
            classifyAsAudioStream: metadata["classifyAsAudioStream"] as! Bool,
            deliveryMode: mapDeliveryMode(deliveryMode: metadata["deliveryMode"] as? String),
            deliverySubscriptionType: mapDeliverySubscriptionType(deliverySubscriptionType: metadata["deliverySubscriptionType"] as? String),
            deliveryComposition: mapDeliveryComposition(deliveryComposition: metadata["deliveryComposition"] as? String),
            deliveryAdvertisementCapability: mapDeliveryAdvertisementCapability(deliveryAdvertisementCapability: metadata["deliveryAdvertisementCapability"] as? String),
            mediaFormat: mapMediaFormat(mediaFormat: metadata["mediaFormat"] as? String),
            distributionModel: mapDistributionModel(distributionModel: metadata["distributionModel"] as? String),
            playlistTitle: metadata["playlistTitle"] as? String,
            totalSegments: (metadata["totalSegments"] as? NSNumber).flatMap({ totalSegments in
                Int(truncating: totalSegments)
            }) ?? nil,
            clipUrl: metadata["clipUrl"] as? String,
            videoDimension: mapDimension(dimension: metadata["videoDimension"] as? [String:NSNumber] ?? [:]),
            customLabels: metadata["customLabels"] as? [String:String]
        )
        return comscoreMetadata
    }
    
    func mapUsagePropertiesAutoUpdateMode(usagePropertiesAutoUpdateMode: String) -> ComscoreUsagePropertiesAutoUpdateMode {
        switch usagePropertiesAutoUpdateMode {
        case "foregroundOnly":
            return .foregroundOnly
        case "foregroundAndBackground":
            return .foregroundAndBackground
        case "disabled":
            return .disabled
        default:
            return .foregroundOnly
        }
    }
    
    func mapUserConsent(userConsent: String) -> ComScoreUserConsent {
        switch userConsent {
        case "-1":
            return .unknown
        case "1":
            return .granted
        case "0":
            return .denied
        default:
            return .denied
        }
        
    }
    
    func mapMediaType(mediaType: String) -> ComScoreMediaType {
        switch mediaType {
        case "longFormOnDemand":
            return .longFormOnDemand
        case "shortFormOnDemand":
            return .shortFormOnDemand
        case "live":
            return .live
        case "userGeneratedLongFormOnDemand":
            return .userGeneratedLongFormOnDemand
        case "userGeneratedShortFormOnDemand":
            return .userGeneratedShortFormOnDemand
        case "userGeneratedLive":
            return .userGeneratedLive
        case "bumper":
            return .bumper
        case "other":
            return .other
        default:
            return .other
        }
    }
    
    func mapFeedType(feedType: String?) -> ComScoreFeedType? {
        switch feedType {
        case "easthd":
            return .eastHD
        case "westhd":
            return .westHD
        case "eastsd":
            return .eastSD
        case "westsd":
            return .westSD
        default:
            return nil
        }
    }
    
    func mapDeliveryMode(deliveryMode: String?) -> ComScoreDeliveryMode? {
        switch deliveryMode {
        case "linear":
            return .linear
        case "ondemand":
            return .ondemand
        default:
            return nil
        }
    }
    
    func mapDeliverySubscriptionType(deliverySubscriptionType: String?) -> ComScoreDeliverySubscriptionType? {
        switch deliverySubscriptionType {
        case "traditionalMvpd":
            return .traditionalMvpd
        case "virtualMvpd":
            return .virtualMvpd
        case "subscription":
            return .subscription
        case "transactional":
            return .transactional
        case "advertising":
            return .advertising
        case "premium":
            return .premium
        default:
            return nil
        }
    }
    
    func mapDeliveryComposition(deliveryComposition: String?) -> ComScoreDeliveryComposition? {
        switch deliveryComposition {
        case "clean":
            return .clean
        case "embed":
            return .embed
        default:
            return nil
        }
    }
    
    func mapDeliveryAdvertisementCapability(deliveryAdvertisementCapability: String?) -> ComScoreDeliveryAdvertisementCapability? {
        switch deliveryAdvertisementCapability {
        case "none":
            return ComScoreDeliveryAdvertisementCapability.none
        case "dynamicLoad":
          return .dynamicLoad
        case "dynamicReplacement":
          return .dynamicReplacement
        case "linear1day":
          return .linear1day
        case "linear2day":
          return .linear2day
        case "linear3day":
          return .linear3day
        case "linear4day":
          return .linear4day
        case "linear5day":
          return .linear5day
        case "linear6day":
          return .linear6day
        case "linear7day":
          return .linear7day
        default:
            return nil
        }
    }
    
    func mapMediaFormat(mediaFormat: String?) -> ComScoreMediaFormat? {
        switch mediaFormat {
        case "fullContentEpisode":
            return .fullContentEpisode
        case "fullContentMovie":
            return .fullContentMovie
        case "fullContentPodcast":
            return .fullContentPodcast
        case "fullContentGeneric":
            return .fullContentGeneric
        case "partialContentEpisode":
            return .partialContentEpisode
        case "partialContentMovie":
            return .partialContentMovie
        case "partialContentPodcast":
            return .partialContentPodcast
        case "partialContentGeneric":
            return .partialContentGeneric
        case "previewEpisode":
            return .previewEpisode
        case "previewMovie":
            return .previewMovie
        case "previewGeneric":
            return .previewGeneric
        case "extraEpisode":
            return .extraEpisode
        case "extraMovie":
            return .extraMovie
        case "extraGeneric":
            return .extraGeneric
        default:
            return nil
        }
    }
    
    func mapDistributionModel(distributionModel: String?) -> ComScoreDistributionModel? {
        switch distributionModel {
        case "tvAndOnline":
            return .tvAndOnline
        case "exclusivelyOnline":
            return .exclusivelyOnline
        default:
            return nil
        }
    }
    
    func mapDate(date: [String:NSNumber]) -> ComScoreDate? {
        if let day = date["day"], let month = date["month"], let year = date["year"] {
            return ComScoreDate(year:Int(truncating: year),month: Int(truncating: month),day: Int(truncating: day))
        } else {
            return nil
        }
    }
    
    func mapTime(time: [String:NSNumber]) -> ComScoreTime? {
        if let hours = time["hours"], let minutes = time["minutes"] {
            return ComScoreTime(hours:Int(truncating: hours),minutes:Int(truncating: minutes))
        } else {
            return nil
        }
    }
    
    func mapDimension(dimension: [String:NSNumber]?) -> THEOplayerConnectorComscore.Dimension? {
        if let width = dimension?["width"], let height = dimension?["height"] {
            return Dimension(width: Int(truncating: width), height: Int(truncating: height))
        } else {
            return nil
        }
    }
}
