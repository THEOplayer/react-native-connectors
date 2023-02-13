import { Constants, ConvivaUtils } from '@convivainc/conviva-js-coresdk';

export const CONVIVA_CALLBACK_FUNCTIONS: ConvivaUtils = {
    [Constants.CallbackFunctions.CONSOLE_LOG](message: string, logLevel: number) {
        if (typeof console === 'undefined') {
            return;
        }
        if (logLevel === Constants.LogLevel.DEBUG || logLevel === Constants.LogLevel.INFO) {
            console.log(message);
        } else if (console.warn && logLevel === Constants.LogLevel.WARNING) {
            console.warn(message);
        } else if (console.error && logLevel === Constants.LogLevel.ERROR) {
            console.error(message);
        }
    },
    [Constants.CallbackFunctions.MAKE_REQUEST](httpMethod, url, data, contentType, timeoutMs, callback) {
        const xmlHttpReq = new XMLHttpRequest();
        xmlHttpReq.open(httpMethod, url, true);
        if (contentType && xmlHttpReq.overrideMimeType) {
            xmlHttpReq.overrideMimeType(contentType);
        }
        if (contentType && xmlHttpReq.setRequestHeader) {
            xmlHttpReq.setRequestHeader('Content-Type', contentType);
        }
        if (timeoutMs > 0) {
            xmlHttpReq.timeout = timeoutMs;
            xmlHttpReq.ontimeout = () => {
                // Often this callback will be called after onreadystatechange.
                // The first callback called will cleanup the other to prevent duplicate responses.
                xmlHttpReq.ontimeout = null;
                xmlHttpReq.onreadystatechange = null;
                if (callback) {
                    callback(false, `timeout after ${timeoutMs} ms`);
                }
            };
        }

        xmlHttpReq.onreadystatechange = () => {
            if (xmlHttpReq.readyState === 4) {
                xmlHttpReq.ontimeout = null;
                xmlHttpReq.onreadystatechange = null;
                if (xmlHttpReq.status === 200) {
                    if (callback) {
                        callback(true, xmlHttpReq.responseText);
                    }
                } else if (callback) {
                    callback(false, `http status ${xmlHttpReq.status}`);
                }
            }
        };
        xmlHttpReq.send(data);
    },
    [Constants.CallbackFunctions.SAVE_DATA](storageSpace, storageKey, data, callback) {
        const localStorageKey = `${storageSpace}.${storageKey}`;
        try {
            localStorage.setItem(localStorageKey, data);
            callback(true, '');
        } catch (e: any) {
            callback(false, e.toString());
        }
    },
    [Constants.CallbackFunctions.LOAD_DATA](storageSpace, storageKey, callback) {
        const localStorageKey = `${storageSpace}.${storageKey}`;
        try {
            const data = localStorage.getItem(localStorageKey) ?? '';
            callback(true, data);
        } catch (e: any) {
            callback(false, e.toString());
        }
    },
    [Constants.CallbackFunctions.GET_EPOCH_TIME_IN_MS]() {
        return Date.now();
    },
    [Constants.CallbackFunctions.CREATE_TIMER](timerAction, intervalMs) {
        const timerId = setInterval(timerAction, intervalMs);
        return () => {
            clearInterval(timerId);
        };
    }
};
