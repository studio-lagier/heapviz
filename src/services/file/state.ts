import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { worker, workerMessages$ } from '../worker';
import { Observable } from 'rxjs';
import { push } from 'react-router-redux';
import { actions as heapActions } from '../heap/state';
const { fromPromise, concat, of } = Observable;
const { heap: { transferProfile } } = heapActions;

//Actions
export const FETCH_LOCAL_FILE = 'file/FETCH_LOCAL_FILE';
export const DRAG_OVER = 'file/DRAG_OVER';
export const DRAG_OUT = 'file/DRAG_OUT';
export const LOAD_FILE = 'file/LOAD_FILE';
export const FILE_LOADED = 'file/FILE_LOADED';

//Reducer
interface FileState {
    hasFile: boolean;
    fetching: boolean;
    fileName: string;
    dragging: boolean;
}

const initialState: FileState = {
    hasFile: false,
    fetching: false,
    fileName: '',
    dragging: false,
}

export default function reducer(state = initialState, action: FSA) {
    switch (action.type) {
        case LOAD_FILE:
        case FETCH_LOCAL_FILE:
            return {
                ...state,
                fetching: true,
                fileName: action.payload
            };
        case FILE_LOADED:
            return {
                ...state,
                fetching: false,
                dragging: false,
                hasFile: true
            };
        case DRAG_OVER:
            return {
                ...state,
                dragging: true
            }
        case DRAG_OUT:
            return {
                ...state,
                dragging: false
            }
        default:
            return state;
    }
}

//Action creators
export const actions = createActions({
    file: {
        FETCH_LOCAL_FILE: (p: string) => p,
        FILE_LOADED: (p: ArrayBuffer) => p,
        DRAG_OVER: () => { },
        DRAG_OUT: () => { },
        LOAD_FILE: (p:string) => p
    }
})

//Epics
const { file: { fileLoaded } } = actions;
export const loadFile: Epic<FSA, any> =
    (action$, store) => action$
        .ofType(FETCH_LOCAL_FILE)
        .mergeMap(({ payload }) => fromPromise(
            fetch(`/profiles/${payload}`)
                .then(result => result.arrayBuffer()))
        )
        .mergeMap(buff => concat(
                of(fileLoaded(buff)),
                of(transferProfile({
                    heap: buff,
                    width: store.getState().renderer.size * 2
                }))
            )
    )

export const onFileLoaded: Epic<FSA, any> =
    action$ => action$
        .ofType(FILE_LOADED)
        .map(() => push('/viz'));