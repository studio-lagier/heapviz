import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs';

//Actions
export const SHOW_MESSAGE = 'message/SHOW_MESSAGE';
export const HIDE_MESSAGE = 'message/HIDE_MESSAGE';

//Reducer
interface FileState {
    showing: boolean;
    message: string;
}

const initialState: FileState = {
    showing: false,
    message: ''
}

export default function reducer(state = initialState, action: FSA) {
    switch (action.type) {
        case SHOW_MESSAGE:
            return {
                ...state,
                showing: true,
                message: action.payload
            };
        case HIDE_MESSAGE:
            return {
                ...state,
                showing: false
            };

        default:
            return state;
    }
}

//Action creators
export const actions = createActions({
    message: {
        SHOW_MESSAGE: (p: string) => p,
        HIDE_MESSAGE: () => { }
    }
})

//Epics
const { message: { showMessage:sm, hideMessage:hm } } = actions;
export const showMessage: Epic<FSA, any> =
    action$ => action$
        .filter(action => action.meta && action.meta.message)
        .map(action => sm(action.meta.message));

export const hideMessage: Epic<FSA, any> =
    action$ => action$
        .filter(action => action.meta && action.meta.hideMessage)
        .map(action => hm());
