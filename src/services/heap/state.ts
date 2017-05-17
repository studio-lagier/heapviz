import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { worker, workerMessages$ } from '../worker';

//Actions
import {
    APPLY_FILTERS,
    FETCH_NODE,
    TRANSFER_PROFILE,
    SEND_NODES,
    PROGRESS_UPDATE,
    NODE_FETCHED,
    PROFILE_LOADED,
    TRANSFER_COMPLETE
} from '../worker/messages';

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
        default:
            return state;
    }
};

//Action creators
export const actions = createActions({
    heap: {
        APPLY_FILTERS: (p: { filters: any, idx: number, width: number }) => p,
        FETCH_NODE: (p: { idx: number }) => p,
        TRANSFER_PROFILE: (p: {heap: ArrayBufferView}) => p
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

