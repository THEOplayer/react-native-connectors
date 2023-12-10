//
//  RemovableEventListener.swift
//  
//
//  Created by Damiaan Dufaux on 01/09/2022.
//

import THEOplayerSDK

public protocol RemovableEventListenerProtocol {
    func remove(from dispatcher: EventDispatcherProtocol)
    
    var description: String {get}
}

public struct RemovableEventListener<Event: EventProtocol>: RemovableEventListenerProtocol {
    let type: EventType<Event>
    let listener: EventListener
    
    public init(type: EventType<Event>, listener: EventListener) {
        self.type = type
        self.listener = listener
    }
    
    public func remove(from dispatcher: EventDispatcherProtocol) {
        dispatcher.removeEventListener(type: type, listener: listener)
    }
    
    public var description: String {
        type.name
    }
}

extension EventDispatcherProtocol {
    public func addRemovableEventListener<Event: EventProtocol>(type: EventType<Event>, listener: @escaping (Event)->Void) -> RemovableEventListener<Event> {
        RemovableEventListener(
            type: type,
            listener: addEventListener(type: type, listener: listener)
        )
    }
    
    public func remove(eventListener: RemovableEventListenerProtocol) {
        eventListener.remove(from: self)
    }
}
