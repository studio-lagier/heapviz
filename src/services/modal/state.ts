import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
// import { Epic } from 'redux-observable';
// import { Observable } from 'rxjs';

//Actions
export const SHOW_MODAL = 'modal/SHOW_MODAL';
export const HIDE_MODAL = 'modal/HIDE_MODAL';

//Reducer
export interface ModalState {
    active: boolean;
    name: string;
}

const initialState: ModalState = {
    active: false,
    name: null
}

export default function reducer(state = initialState, action: FSA) {
    const { payload } = action;
    switch (action.type) {
        case SHOW_MODAL:
            return {
                ...state,
                active: true,
                name: payload
            };
        case HIDE_MODAL:
            return {
                ...state,
                active: false
            };
        default:
            return state;
    }
}

//Action creators
export const actions = createActions({
    modal: {
        SHOW_MODAL: (p: boolean) => p,
        HIDE_MODAL: () => {}
    }
});