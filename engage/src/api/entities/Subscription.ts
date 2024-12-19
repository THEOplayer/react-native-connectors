import { Entity, EntityType } from '@theoplayer/react-native-engage';

export enum SubscriptionType {
  /**
   * The user has an unspecified subscription type.
   */
  Unspecified = 0,

  /**
   * The user has a paid subscription currently active.
   */
  Active = 1,

  /**
   * The user has a trial subscription.
   */
  ActiveTrial = 2,

  /**
   * The user has an account but no active subscription or trial.
   */
  Inactive = 3,
}

/**
 * An object representing a subscription entitlement.
 *
 * {@link https://developers.google.com/android/reference/kotlin/com/google/android/engage/common/datamodel/SubscriptionEntitlement | SubscriptionEntitlement}.
 */
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
 * An object representing a subscription.
 *
 * {@link https://developers.google.com/android/reference/kotlin/com/google/android/engage/common/datamodel/SubscriptionEntity | SubscriptionEntity}.
 */
export interface Subscription extends Entity {
  /**
   * The entity type.
   */
  type: EntityType.Subscription;

  /**
   * The package name of the app that handles the subscription.
   *
   * @example "com.google.android.youtube".
   */
  providerPackageName: string;

  /**
   * The type of subscription.
   */
  subscriptionType: SubscriptionType;

  /**
   * The optional subscription's expiration time in milliseconds since epoch.
   */
  expirationTime?: number;

  /**
   * If you offer multi-tiered premium subscription packages,
   * which includes expanded content or features beyond the common tier, you can represent this by adding one or
   * more entitlements to Subscription.
   */
  entitlements?: Entitlement[];
}
