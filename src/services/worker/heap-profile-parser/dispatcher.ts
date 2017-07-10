import { FluxStandardAction } from '../../../../typings/fsa';

function toActionName(name: string): string {
    return `heap/${name.split(/(?=[A-Z])/).map((s: string) => s.toUpperCase()).join('_')}`;
}

export class Dispatcher {
    _objects: Array<any>;
    _global: WorkerGlobalScope;
    _postMessage: Function;

    constructor(globalObject: WorkerGlobalScope, postMessage: Function) {
        this._objects = [];
        this._global = globalObject;
        this._postMessage = postMessage;
    }

    /**
     * @param {string} name
     * @param {*} data
     */
    sendEvent(eventName: string, data?: any, transferrables?: Array<any>, meta?: any) {

        this._postMessage({
            //Handle both chrome and our standard actions
            type: eventName.indexOf('/') === -1 ? toActionName(eventName) : eventName,
            payload: data,
            meta
        }, transferrables);
    }
};