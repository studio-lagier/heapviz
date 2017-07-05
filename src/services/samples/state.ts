import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs';

//Actions
import { PROFILE_LOADED } from '../worker/messages';
export const UPDATE_START = 'samples/UPDATE_START';
export const UPDATE_END = 'samples/UPDATE_END';

//Reducer
export interface Sample {
    nodeCount: number;
    totalSize: number;
}

export interface SamplesState {
    start: number;
    end: number;
    [key: string]: any;
}

export const initialSamples: SamplesState = {
    start: 0,
    end: 0,
    stats: null
}

export default function reducer(state = initialSamples, action: FSA) {
    const { payload } = action;
    switch (action.type) {
        case UPDATE_START:
            return {
                ...state,
                start: payload
            };
        case UPDATE_END:
            return {
                ...state,
                end: payload
            };
        case PROFILE_LOADED:
            return {
                ...state,
                stats: payload.stats
            }
        default:
            return state;
    }
}

//Action creators
export const actions = createActions({
    samples: {
        UPDATE_START: (p: boolean) => p,
        UPDATE_END: (p: boolean) => p
    }
});