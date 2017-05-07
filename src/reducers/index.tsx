import { FluxStandardAction } from '../../typings/fsa';
interface StoreState { }
interface ActionPayload { }
interface ActionMeta { }


export default {
    one: (state: StoreState, action: FluxStandardAction<ActionPayload, ActionMeta>): StoreState => state
}