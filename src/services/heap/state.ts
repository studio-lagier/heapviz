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
export default function reducer(state = {
    message: 'Idle'
}, action: FSA) {
    switch (action.type) {
        case APPLY_FILTERS:
            return state;
        case FETCH_NODE:
            return state;
        case TRANSFER_PROFILE:
            return {
                ...state,
                message: 'Begun transfer',
                computing: true
            }
        case SEND_NODES:
            return {
                ...state,
                message: 'Nodes have transferred, rendering!'
            };
        case PROGRESS_UPDATE:
            return {
                ...state,
                message: action.payload,
            }
        case NODE_FETCHED:
            return state;
        case PROFILE_LOADED:
            const { stats, nodeTypes } = action.payload;
            return {
                ...state,
                message: 'Profile has loaded',
                stats, nodeTypes
            }
        case TRANSFER_COMPLETE:
            return {
                ...state,
                message: 'Transfer complete!',
                computing: false
            }
        default:
            return state;
    }
};

//Action creators
export const actions = createActions({
    heap: {
        APPLY_FILTERS: (p: { filters: any, idx: number, width: number }) => p,
        FETCH_NODE: (p: { idx: number }) => p,
        TRANSFER_PROFILE: (p: { heap: ArrayBufferView }) => p,
        TRANSFER_COMPLETE: () => { }
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
            worker.postMessage(action);
            return workerMessages$
                .takeUntil(workerMessages$.ofType(TRANSFER_COMPLETE));
        });
