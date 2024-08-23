export enum Availability {
  /**
   * AVAILABLE: The content is available to the user without any further action.
   */
  Available,

  /**
   * FREE_WITH_SUBSCRIPTION: The content is available after the user purchases a subscription.
   */
  FreeWithSubscription,

  /**
   * PAID_CONTENT: The content requires user purchase or rental.
   */
  PaidContent,

  /**
   * PURCHASED: The content has been purchased or rented by the user.
   */
  Purchased
}
