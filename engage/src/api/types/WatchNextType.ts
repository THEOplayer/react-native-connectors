export enum WatchNextType {

  /**
   * CONTINUE: The user has already watched more than 1 minute of this content.
   */
  Continue,

  /**
   * NEW: The user has watched all available episodes from some episodic content, but a new episode has become
   * available and there is exactly one unwatched episode. This works for TV shows, recorded soccer matches in a
   * series, and so on.
   */
  New,

  /**
   * NEXT: The user has watched one or more complete episodes from some episodic content, but there remains
   * either more than one episode remaining or exactly one episode remaining where the last episode is not "NEW"
   * and was released before the user started watching the episodic content.
   */
  Next,

  /**
   * WATCHLIST: The user has explicitly elected to add a movie, event, or series to a watchlist to manually
   * curate what they want to watch next.
   */
  Watchlist
}
