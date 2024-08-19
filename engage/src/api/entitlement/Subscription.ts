import { Entitlement } from "./Entitlement";

export enum SubscriptionType {
  UNSPECIFIED = 0,
  ACTIVE = 1,
  ACTIVE_TRIAL = 2,
  INACTIVE = 3
}

/**
 * Subscription.
 */
export interface Subscription {
  /**
   * providerPackageName
   */
  providerPackageName: string;

  /**
   * subscriptionType
   */
  subscriptionType: SubscriptionType;

  /**
   * The optional subscription's expiration time in milliseconds.
   */
  expirationTime?: number;

  /**
   * If you offer multi-tiered premium subscription packages,
   * which includes expanded content or features beyond the common tier, you can represent this by adding one or
   * more entitlements to Subscription.
   */
  entitlements?: Entitlement[];
}
