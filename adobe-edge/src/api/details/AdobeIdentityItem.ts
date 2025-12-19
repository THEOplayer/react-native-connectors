/**
 * The state this identity is authenticated as for this observed ExperienceEvent.
 *
 * - `ambiguous`: Ambiguous.
 * - `authenticated`: User identified by a login or similar action that was valid at the time of the event observation.
 * - `loggedOut`: User was identified by a login action at some point of time previously, but is not currently logged in.
 */
export type AuthenticatedState = 'ambiguous' | 'authenticated' | 'loggedOut';

/**
 * An end user identity item, to be included in an instance of `context/identitymap`.
 *
 * {@link https://github.com/adobe/xdm/blob/master/components/datatypes/identityitem.schema.json}
 */
export interface AdobeIdentityItem {
  /**
   * Identity of the consumer in the related namespace.
   */
  id: string;

  /**
   * The state this identity is authenticated as for this observed ExperienceEvent.
   *
   * @default `ambiguous`.
   */
  authenticatedState: AuthenticatedState;

  /**
   * Indicates this identity is the preferred identity. Is used as a hint to help systems better organize how
   * identities are queried.
   *
   * @default `false`.
   */
  primary: boolean;
}
