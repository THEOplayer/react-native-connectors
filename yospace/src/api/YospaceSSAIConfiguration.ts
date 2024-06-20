import { ServerSideAdInsertionConfiguration, TypedSource } from "react-native-theoplayer";
import { YospaceSessionProperties } from "./YospaceSessionProperties";

/**
 * The identifier of the Yospace integration.
 *
 * @public
 */
export type YospaceSSAIIntegrationID = 'yospace';

/**
 * The type of the Yospace stream, represented by a value from the following list:
 * <br/> - `'live'`: The stream is a live stream.
 * <br/> - `'livepause'`: The stream is a live stream with a large DVR window.
 * <br/> - `'nonlinear'`: The stream is a Non-Linear Start-Over stream.
 * <br/> - `'vod'`: The stream is a video-on-demand stream.
 *
 * @public
 */
export enum YospaceStreamType {
  vod = 'vod',
  live = 'live',
  livepause = 'livepause',
  nonlinear = 'nonlinear'
}

/**
 * Represents a configuration for server-side ad insertion with Yospace.
 *
 *
 * @public
 */
export interface YospaceSSAIConfiguration extends ServerSideAdInsertionConfiguration {
  /**
   * The identifier for the SSAI pre-integration.
   */
  integration: YospaceSSAIIntegrationID;

  /**
   * The type of the requested stream.
   *
   * @defaultValue `'live'`
   */
  streamType?: YospaceStreamType;

  /**
   * Custom session properties.
   */
  sessionProperties?: YospaceSessionProperties;
}

/**
 * Represents a media resource with a Yospace server-side ad insertion request.
 *
 * @public
 */
export interface YospaceTypedSource extends TypedSource {
  ssai: YospaceSSAIConfiguration;
}
