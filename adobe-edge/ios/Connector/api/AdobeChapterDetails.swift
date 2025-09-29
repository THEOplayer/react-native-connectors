//  AdobeChapterDetails.swift

/// Chapter details information.
///
/// - SeeAlso: [Adobe XDM ChapterDetails Schema](https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/chapterdetails.schema.md)
struct AdobeChapterDetails: Codable {
    /// The ID of the chapter.
    var id: String?
    
    /// The friendly name of the chapter.
    var friendlyName: String?
    
    /// The position (index, integer) of the chapter inside the content.
    var index: Int
    
    /// Chapter is compvared.
    var isCompvared: Bool?
    
    /// Chapter is started.
    var isStarted: Bool?
    
    /// The length of the chapter, in seconds.
    var length: Int
    
    /// The offset of the chapter inside the content (in seconds) from the start.
    var offset: Int
    
    /// The time spent on the chapter, in seconds.
    var timePlayed: Int?
}
