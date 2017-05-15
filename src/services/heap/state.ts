import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { worker, workerMessages$ } from '../worker';

//Actions
export const APPLY_FILTERS = 'heap/APPLY_FILTERS';
export const FETCH_NODE = 'heap/FETCH_NODE';
export const TRANSFER_PROFILE = 'heap/TRANSFER_PROFILE';
export const SEND_NODES = 'heap/SEND_NODES';
export const PROGRESS_UPDATE = 'heap/PROGRESS_UPDATE';
export const NODE_FETCHED = 'heap/NODE_FETCHED';
export const PROFILE_LOADED = 'heap/PROFILE_LOADED';
export const TRANSFER_COMPLETE = 'heap/TRANSFER_COMPLETE';

//Reducer
export default function reducer(state = {}, action: FSA) {
    switch (action.type) {
        case APPLY_FILTERS:
        case FETCH_NODE:
        case TRANSFER_PROFILE:
        case SEND_NODES:
        case PROGRESS_UPDATE:
        case NODE_FETCHED:
        case PROFILE_LOADED:
        case TRANSFER_COMPLETE:
    }
};

//Action creators
const enableWorker = { WebWorker: true };
export const actions = createActions({
    heap: {
        APPLY_FILTERS: [
            (p: { filters: any, idx: number, width: number }) => p,
            enableWorker
        ],
        FETCH_NODE: [
            (p: { idx: number }) => p,
            enableWorker
        ],
        TRANSFER_PROFILE: [
            (p: {heap: ArrayBufferView}) => p,
            enableWorker
        ]
    }
})

//Epics
export const applyFilters: Epic<FSA, any> =
    action$ => action$
        .ofType(APPLY_FILTERS)
        .mergeMap(action => {
            worker.postMessage(action);
            return workerMessages$
                .takeUntil(workerMessages$.ofType(TRANSFER_COMPLETE));
        });

export const fetchNode: Epic<FSA, any> =
    action$ => action$
        .ofType(FETCH_NODE)
        .mergeMap(action => {
            worker.postMessage(action)
            return workerMessages$
                .takeUntil(workerMessages$.ofType(NODE_FETCHED))
        });

export const transferProfile: Epic<FSA, any> =
    action$ => action$
        .ofType(TRANSFER_PROFILE)
        .mergeMap(action => {
            worker.postMessage(action)
            return workerMessages$
                .takeUntil(workerMessages$.ofType(TRANSFER_COMPLETE))
        });

