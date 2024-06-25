import { AdobeConnector, } from "@theoplayer/react-native-analytics-adobe-edge";
import { THEOplayer } from "react-native-theoplayer";
import { jest } from "@jest/globals";

describe('AdobeConnector', () => {
  let connector: AdobeConnector;
  let player: THEOplayer;
  let baseUrl: string;
  let dataStreamId: string;
  let userAgent: string;
  let useDebug: boolean;
  let debugSessionId: string;

  beforeEach(() => {
    player = {
      ads: {
        playing: jest.fn().mockReturnValue(false)
      },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as THEOplayer;

    baseUrl = 'https://example.com';
    dataStreamId = 'example-datastream';
    userAgent = 'Mozilla/5.0';
    useDebug = true;
    debugSessionId = 'debug-session-id';

    // Create a new instance of AdobeConnector with mocked dependencies
    connector = new AdobeConnector(player, baseUrl, dataStreamId, userAgent, useDebug, debugSessionId);
  });

  it('should add listeners on create', () => {
    const spy = jest.spyOn(player, 'addEventListener');
    expect(spy).toHaveBeenCalled();
  });

  it('should remove listeners on destroy', async () => {
    connector.destroy();
    await new Promise(process.nextTick);
    const spy = jest.spyOn(player, 'removeEventListener');
    expect(spy).toHaveBeenCalled();
  });
});
