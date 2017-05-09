import { FluxStandardAction } from '../../../typings/fsa';

export class Dispatcher {
    _objects: Array<any>;
    _global: Window;
    _postMessage: Function;

    constructor(globalObject: Window, postMessage: Function) {
        this._objects = [];
        this._global = globalObject;
        this._postMessage = postMessage;
    }

    /**
     * @param {string} name
     * @param {*} data
     */
    sendEvent(eventName: string, data?: any, transferrables?: Array<any>) {

        this._postMessage({
            type: eventName,
            payload: data
        }, transferrables);
    }
};