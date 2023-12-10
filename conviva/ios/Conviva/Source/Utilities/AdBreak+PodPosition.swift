//
//  PodPosition.swift
//  
//
//  Created by Damiaan Dufaux on 07/09/2022.
//

import THEOplayerSDK
import ConvivaSDK

extension AdBreak {
    var convivaAdPosition: AdPosition {
        switch timeOffset {
        case 0   : return .ADPOSITION_PREROLL
        case ..<0: return .ADPOSITION_POSTROLL
        default:   return .ADPOSITION_MIDROLL
        }
    }
}
