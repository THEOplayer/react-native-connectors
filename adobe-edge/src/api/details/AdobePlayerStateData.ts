/**
 * Player state data information.
 *
 * https://github.com/adobe/xdm/blob/master/components/datatypes/playerstatedata.schema.json
 */
export interface AdobePlayerStateData {
  // The name of the player state.
  name: string;

  // Whether or not the player state is set on that state.
  isSet?: boolean;

  // The number of times that player state was set on the stream.
  count?: number;

  // he total duration of that player state.
  time?: number;
}
