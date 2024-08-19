import { Entity, EntityType } from "@theoplayer/react-native-engage";

export enum SubscriptionType {
  Unspecified = 0,
  Active = 1,
  ActiveTrial = 2,
  Inactive = 3
}

export interface Entitlement {
  /**
   * Required identifier string for this entitlement. This must match one of the entitlement identifiers provided in
   * the media provider’s feed published to Google TV. For example,
   * example.com:131d54bc3d714a5aa2adee6ec9533a3d and example.tv:free are all valid entitlement identifiers.
   */
  id: string;

  /**
   * The name is auxiliary information and is used for entitlement matching. While optional, providing a
   * human-readable entitlement name enhances understanding of user entitlements for both developers and support teams.
   * For example: Sling Orange.
   */
  name?: string;

  /**
   * You can optionally specify the expiration time in milliseconds for this entitlement, if it differs from the
   * subscription expiration time. When this field is not set, we assume that the entitlement will expire at the same
   * time the subscription expires.
   */
  expirationTime?: number;
}

/**
 * Subscription.
 */
export interface Subscription extends Entity {
  /**
   * The entity type.
   */
  type: EntityType.Subscription;

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
