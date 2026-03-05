type Listener = (...args: any[]) => void;

/**
 * Minimal synchronous event-emitter that mimics the THEOplayer EventDispatcher
 * interface well enough for unit tests.
 */
export class EventEmitter {
  private _listeners: Map<string, Listener[]> = new Map();

  addEventListener(event: string, listener: Listener) {
    const list = this._listeners.get(event) ?? [];
    list.push(listener);
    this._listeners.set(event, list);
  }

  removeEventListener(event: string, listener: Listener) {
    const list = this._listeners.get(event) ?? [];
    this._listeners.set(
      event,
      list.filter((l) => l !== listener),
    );
  }

  emit(event: string, ...args: any[]) {
    (this._listeners.get(event) ?? []).forEach((l) => l(...args));
  }
}
