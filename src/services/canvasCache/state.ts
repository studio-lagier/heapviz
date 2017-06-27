import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { toCacheKey } from './';
import { initialFilters, SUBMIT_FILTERS } from '../filters/state';
import { initialSamples } from '../samples/state';

//Actions
export const INITIALIZE_CACHE = 'canvasCache/INITIALIZE_CACHE';
export const UPDATE_KEY = 'canvasCache/UPDATE_KEY';

//Reducer
interface CacheState {
    initialized: boolean;
    hasCachedCanvases: boolean;
    cacheKey: string;
}

const initialState: CacheState = {
    initialized: false,
    hasCachedCanvases: false,
    cacheKey: toCacheKey({
        filters: initialFilters,
        samples: initialSamples
    })
}

export default function reducer(state = initialState, action: FSA) {
    switch (action.type) {
        case INITIALIZE_CACHE:
            return {
                ...state,
                initialized: true
            };
        case UPDATE_KEY:
            return {
                ...state,
                cacheKey: action.payload,
            };
        default:
            return state;
    }
}

//Action creators
export const actions = createActions({
    canvasCache: {
        INITIALIZE_CACHE: () => { },
        UPDATE_KEY: (p:string) => p
    }
})

//Epics
const { canvasCache: { updateKey } } = actions;
export const onApplyFilters: Epic<FSA, any> =
    action$ => action$
        .ofType(SUBMIT_FILTERS)
        .map(({ payload }) => updateKey(toCacheKey(payload)));