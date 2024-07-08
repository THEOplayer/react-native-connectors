import { Entity, EntityType } from "./Entity";
import { AccountProfile } from "../types/AccountProfile";

/**
 * Subscription.
 */
export interface Subscription extends Entity {
  type: EntityType.Subscription;

  /**
   * The profile to which this subscription belongs.
   */
  accountProfile: AccountProfile;

  /**
   * providerPackageName
   */
  providerPackageName?: string;

  /**
   * The subscription's expiration time in milliseconds.
   */
  expirationTime?: number;

  /**
   * subscriptionType
   */
  subscriptionType?: number;
}
