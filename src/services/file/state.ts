import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { worker, workerMessages$ } from '../worker';
import { Observable } from 'rxjs';
const { fromPromise } = Observable;

//Actions
export const FETCH_LOCAL_FILE = 'file/FETCH_LOCAL_FILE';
export const LOCAL_FILE_FETCHED = 'file/LOCAL_FILE_FETCHED';

//Reducer
interface FileState {
    fetching: boolean;
    fileName: string;
    fileBuffer?: ArrayBuffer;
}

const initialState: FileState = {
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
        case LOCAL_FILE_FETCHED:
            return {
                ...state,
                fetching: false,
                fileBuffer: action.payload
            };

        default:
            return state;
    }
}

//Action creators
export const actions = createActions({
    file: {
        FETCH_LOCAL_FILE: (p: string) => p,
        LOCAL_FILE_FETCHED: (p: ArrayBuffer) => p
    }
})

//Epics
const { file: { localFileFetched } } = actions;
export const loadFile: Epic<FSA, any> =
    action$ => action$
        .ofType(FETCH_LOCAL_FILE)
        .mergeMap(({ payload }) => {
            return fromPromise(fetch(`/profiles/${payload}`)
                .then(result => result.arrayBuffer())
                .then(buff => localFileFetched(buff)))
        })