import { Buffer } from 'buffer';

try {
  __DEBUG__ = false;
} catch (ignored) {
  /*ignore*/
}

export class AgamaPolyfills {
  static install() {
    if (__DEBUG__) {
      console.log('Installing Agama polyfills.');
    }
    _global = globalThis;
    _global.btoa = function (data: string) {
      return Buffer.from(data, 'binary').toString('base64');
    };
  }

  static isInstalled(): boolean {
    return _global !== undefined && typeof _global.btoa === 'function';
  }
}
