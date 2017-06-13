import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { worker, workerMessages$ } from '../worker';
import { Node } from '../worker/heap-profile-parser';

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
}, {type, payload}: FSA) {
    switch (type) {
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
                message: payload,
            }
        case NODE_FETCHED:
            return state;
        case PROFILE_LOADED:
            const { stats, nodeTypes } = payload;
            return {
                ...state,
                message: 'Profile has loaded',
                stats, nodeTypes
            }
        case TRANSFER_COMPLETE:
            return {
                ...state,
                message: 'Transfer complete!',
                computing: false,
                nodes: payload
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
        TRANSFER_COMPLETE: (p: Node[]) => p
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

const { heap: { transferComplete } } = actions;
export const decodeNodes: Epic<FSA, any> =
    action$ => action$
        .ofType(SEND_NODES)
        .map(({ payload: nodes }: FSA) => {
            const decoder = new TextDecoder();
            const heap: Node[] = JSON.parse(decoder.decode(nodes));
            return transferComplete(heap);
        });

