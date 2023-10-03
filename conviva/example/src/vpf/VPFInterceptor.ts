import type { InterceptableRequest } from "theoplayer";
import type { THEOplayer } from "react-native-theoplayer";
import { Platform } from "react-native";
import type { ChromelessPlayer } from "theoplayer";

export const installVPFInterceptor = (player: THEOplayer | undefined): void => {
  if (!player) {
    console.warn('VPFInterceptor', 'invalid player');
    return;
  }
  if (Platform.OS !== 'web') {
    console.warn('VPFInterceptor', 'only available on web');
    return;
  }
  const interceptor = (request: InterceptableRequest) => {
    // Map the host to a non-existing host (foobar.com) during video playback.
    const redirectRequest = {
      ...request,
      url: request.url.replace('theoplayer.com', 'foobar.com')
    };
    request.redirect(redirectRequest);
  }
  (player?.nativeHandle as ChromelessPlayer).network.addRequestInterceptor(interceptor);
}
