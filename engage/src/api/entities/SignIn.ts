import { Entity, EntityType } from "./Entity";

/**
 * SignIn.
 */
export interface SignIn extends Entity {
  /**
   * The entity type.
   */
  type: EntityType.SignIn;

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
