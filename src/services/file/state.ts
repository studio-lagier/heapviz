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
export const FILE_LOADED = 'file/FILE_LOADED';

//Reducer
interface FileState {
    hasFile: boolean;
    fetching: boolean;
    fileName: string;
    fileBuffer?: ArrayBuffer;
}

const initialState: FileState = {
    hasFile: false,
    fetching: false,
    fileName: '',
    fileBuffer: null
}

export default function reducer(state = initialState, action: FSA) {
    switch (action.type) {
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
                fileBuffer: action.payload,
                hasFile: true
            };

        default:
            return state;
    }
}

//Action creators
export const actions = createActions({
    file: {
        FETCH_LOCAL_FILE: (p: string) => p,
        FILE_LOADED: (p: ArrayBuffer) => p
    }
})

//Epics
const { file: { fileLoaded } } = actions;
export const loadFile: Epic<FSA, any> =
    action$ => action$
        .ofType(FETCH_LOCAL_FILE)
        .mergeMap(({ payload }) => fromPromise(
            fetch(`/profiles/${payload}`)
                .then(result => result.arrayBuffer()))
        )
        .mergeMap(buff => concat(
                of(fileLoaded(buff)),
                of(transferProfile({
                    heap: buff,
                    width: getWidth() * 2
                }))
            )
    )

export const onFileLoaded: Epic<FSA, any> =
    action$ => action$
        .ofType(FILE_LOADED)
        .map(() => push('/viz'));

//TODO: Move this somewhere better - maybe get this in the store as a part of the app component?
function getWidth(): number {
    return Math.min(window.innerWidth, window.innerHeight);
}