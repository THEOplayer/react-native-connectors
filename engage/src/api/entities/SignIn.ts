import { Entity, EntityType } from './Entity';
import { Poster } from '../types';

/**
 * An entity representing a sign in card.
 *
 * {@link https://developers.google.com/android/reference/kotlin/com/google/android/engage/common/datamodel/SignInCardEntity | SignInCardEntity}.
 */
export interface SignIn extends Entity {
  /**
   * The entity type.
   */
  type: EntityType.SignIn;

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

  /**
   * The deep link to the provider app to open a sign in screen.
   */
  actionUri?: string;

  /**
   * Text Shown on the CTA (i.e. Sign in).
   */
  actionText?: string;

  /**
   * Optional subtitle.
   */
  subtitle?: string;
}
