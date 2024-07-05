import { Poster } from "../types";

export enum EntityType {
  LiveStream = "liveStream",
  Movie = "movie",
  TvEpisode = 'tvEpisode',
  TvSeason = 'tvSeason',
  TvShow = 'tvShow',
  VideoClip = 'videoClip',
  SignIn = 'signIn'
}

export interface Entity {
  /**
   * The entity's type.
   */
  type: EntityType;

  /**
   * The entity's name or title.
   */
  name: string;

  /**
   * The optional entity id.
   */
  id?: string;

  /**
   * At least one image is required, and must be provided with an aspect ratio.
   * (Landscape is preferred but passing both portrait and landscape images for different scenarios is recommended.)
   */
  posters: Poster[];
}
