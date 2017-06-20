import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { worker, workerMessages$ } from '../worker';
import { Node } from '../worker/heap-profile-parser';
import { actions as messagesActions } from '../messages/state';

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
const PICK_NODE = 'heap/PICK_NODE';

//Reducer
export default function reducer(state = {
    message: 'Idle'
}, {type, payload}: FSA) {
    switch (type) {
        case APPLY_FILTERS:
            return state;
        case FETCH_NODE:
            return state;
        case PICK_NODE:
            return {
                ...state,
                hoverNode: payload
            };
        case TRANSFER_PROFILE:
            return {
                ...state,
                computing: true
            }
        case NODE_FETCHED:
            return {
                ...state,
                currentNode: payload.node
            };
        case PROFILE_LOADED:
            const { stats, nodeTypes } = payload;
            return {
                ...state,
                stats, nodeTypes
            }
        case TRANSFER_COMPLETE:
            return {
                ...state,
                computing: false,
                nodes: payload
            }
        default:
            return state;
    }
};

function sendMessage(message:string) {
    return { message };
}

//Action creators
export const actions = createActions({
    heap: {
        APPLY_FILTERS: (p: { filters: any, idx: number, width: number }) => p,
        FETCH_NODE: (p:number) => p,
        TRANSFER_PROFILE: [
            (p: { heap: ArrayBufferView }) => p,
            () => sendMessage('Begun transfer')
        ],
        TRANSFER_COMPLETE: [
            (p: Node[]) => p,
            () => sendMessage('Transfer complete!')
        ],
        PICK_NODE: (p: Node) => p
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
                .ofType(NODE_FETCHED)
                .take(1);
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

const { message: { showMessage } } = messagesActions;
export const addProgressUpdateMessages: Epic<FSA, any> =
    action$ => action$
        .ofType(PROGRESS_UPDATE)
        .map(action => showMessage(action.payload));