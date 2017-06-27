import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { sendMessage } from '../messages/state';
import { SamplesState } from '../samples/state';

//Actions
export const UPDATE_FILTER = 'filters/UPDATE_FILTER';
export const SUBMIT_FILTERS = 'filters/SUBMIT_FILTERS';

//Reducer
export interface FilterState {
    retainedSize: number;
    selfSize: number;
    edgesCount: number;
    retainersCount: number;
    type: string;
    [key: string]: string|number;
}

export const initialFilters: FilterState = {
    retainedSize: 100,
    selfSize: 100,
    edgesCount: 0,
    retainersCount: 0,
    type: 'all'
}

export default function reducer(state = initialFilters, action: FSA) {
    switch (action.type) {
        case UPDATE_FILTER:
            const { type, value } = action.payload;
            return {
                ...state,
                [type]: value
            };
        default:
            return state;
    }
}

//Action creators
interface UpdateFiltersPayload {
    type: string;
    value: string | number;
}

interface SubmitFiltersPayload {
    filters: FilterState,
    samples: SamplesState
}
export const actions = createActions({
    filters: {
        UPDATE_FILTER: (p: UpdateFiltersPayload) => p,
        SUBMIT_FILTERS: [
            (p: SubmitFiltersPayload) => p,
            () => sendMessage('Applying filters')
        ]
    }
});