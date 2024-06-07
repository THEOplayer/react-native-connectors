import type { THEOplayer } from 'react-native-theoplayer';
import { MuxConnectorAdapter } from '../internal/MuxConnectorAdapter';
import type { MuxOptions } from './MuxOptions';
import type { MuxData } from './MuxData';

export enum MuxPresentation {
  FULLSCREEN = 'FULLSCREEN',
  NORMAL = 'NORMAL',
}

export class MuxConnector {
  private connectorAdapter: MuxConnectorAdapter;

  /**
   * Create a new Mux connector instance.
   */
  constructor(player: THEOplayer, options: MuxOptions) {
    this.connectorAdapter = new MuxConnectorAdapter(player, options);
  }

  /**
   * When you change to a new video (in the same player) you need to update the information that Mux knows
   * about the current video. Examples of when this is needed are:
   *
   * - The player advances to the next video in a playlist;
   * - The user selects a different video to play.
   *
   * changeVideo which will remove all previous video data and reset all metrics for the video view.
   * You can include any metadata when changing the video, but you should only need to update the values
   * that start with video.
   *
   * It's best to change the video info immediately after telling the player which new source to play.
   */
  changeVideo(data: MuxData) {
    this.connectorAdapter.changeVideo(data);
  }

  /**
   * In some cases, you may have the program change within a stream, and you may want to track each program as a
   * view on its own. An example of this is a live stream that streams multiple programs back to back,
   * with no interruptions.
   * You can include any metadata when changing the video, but you should only need to update the values that start
   * with video.
   */
  changeProgram(data: MuxData) {
    this.connectorAdapter.changeProgram(data);
  }

  /**
   * For most use cases, the Mux connector is capable of detecting whether a video is being played full-screen.
   * Specifically, it can do so in the case where the player view is the same size as the device display
   * (except ActionBars and other framework window decoration).
   *
   * For other uses cases (non-overlaid controls, window decoration via plain Views, etc.) you may need to tell the
   * SDK when the user switches to full-screen.
   */
  changePresentation(presentation: MuxPresentation) {
    this.connectorAdapter.changePresentation(presentation);
  }

  /**
   * By default, the Mux connector automatically tracks fatal errors.
   * If a fatal error happens outside the player context, and you want to track it with Mux, you can call notifyError.
   *
   * @param code integer value for the generic type of error that occurred.
   * @param message String providing more information on the error that occurred.
   * @param context Additional context for the error.
   */
  notifyError(code: number, message: string, context: string) {
    this.connectorAdapter.notifyError(code, message, context);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
