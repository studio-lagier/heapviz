import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';

//Actions
export const START_TUTORIAL = 'tutorial/START_TUTORIAL';
export const STOP_TUTORIAL = 'tutorial/STOP_TUTORIAL';

//Reducer
export interface TutorialState {
    running: boolean;
}

const initialState: TutorialState = {
    running: false
}

export default function reducer(state = initialState, action: FSA) {
    switch (action.type) {
        case START_TUTORIAL:
            return {
                ...state,
                running: true
            };
        case STOP_TUTORIAL:
            return {
                ...state,
                running: false
            };
        default:
            return state;
    }
}

//Action creators
export const actions = createActions({
    tutorial: {
        START_TUTORIAL: () => {},
        STOP_TUTORIAL: () => {}
    }
});