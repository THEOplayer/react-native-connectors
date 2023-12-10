//
//  DispatchObserver.swift
//  
//
//  Created by Damiaan Dufaux on 21/09/2022.
//

import THEOplayerSDK

/// A place to safely store event listeners. Once instances of this object get released, listeners stored inside it are also removed
public class DispatchObserver {
    private weak var _dispatcher: AnyObject?
    let eventListeners: [RemovableEventListenerProtocol]
        
    public init(dispatcher: EventDispatcherProtocol, eventListeners: [RemovableEventListenerProtocol]) {
        _dispatcher = dispatcher as AnyObject
        self.eventListeners = eventListeners
    }
        
    deinit {
        if let dispatcher = _dispatcher as! EventDispatcherProtocol? {
            for listener in eventListeners {
                dispatcher.remove(eventListener: listener)
            }
        }
    }
}
