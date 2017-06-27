import { createActions } from 'redux-actions';
import { FSA } from '../../../typings/fsa';
import { Epic } from 'redux-observable';
import { worker, workerMessages$ } from '../worker';
import { Observable } from 'rxjs';
import { drawNodes, renderCache } from './';
import { createColorGenerator } from './colors';
import { actions as heapActions } from '../heap/state';
import { SUBMIT_FILTERS } from '../filters/state';
import { getCanvases, toCacheKey } from '../canvasCache';

const { concat, of } = Observable;

//Actions
import {
    APPLY_FILTERS,
    FETCH_NODE,
    TRANSFER_PROFILE,
    SEND_NODES,
    PROGRESS_UPDATE,
    NODE_FETCHED,
    PROFILE_LOADED,
    TRANSFER_COMPLETE
} from '../worker/messages';
export const RENDER_PROFILE = 'renderer/RENDER_PROFILE';
export const RENDER_CACHE = 'renderer/RENDER_CACHE';
export const RENDER_BATCH = 'renderer/RENDER_BATCH';
export const RENDER_COMPLETE = 'renderer/RENDER_COMPLETE';

//Reducer
interface RendererState {
    width: number;
    height: number;
    cache: boolean;
}
export default function reducer(state: RendererState, {type, payload}:FSA) {
    switch (type) {
        case RENDER_CACHE:
            return {
                ...state,
                drawing: true,
                cached: true
            }
        case RENDER_PROFILE:
            return {
                ...state,
                drawing: true,
                cached: false
            }
        case RENDER_BATCH:
            return {
                ...state,
                cached: false,
                start: payload
            }
        case RENDER_COMPLETE:
            return {
                ...state,
                drawing: false
            }
        default:
            const w = getWidth();
            return state || { width: w, height: w, cached: false };
    }
}

//TODO: Move this somewhere better - maybe get this in the store as a part of the app component?
function getWidth(): number {
    return Math.min(window.innerWidth, window.innerHeight);
}
//Action creators
export const actions = createActions({
    renderer: {
        RENDER_PROFILE: (p: ArrayBuffer) => p,
        RENDER_BATCH: (p: number) => p,
        RENDER_COMPLETE: [
            () => { },
            () => {return {hideMessage:true}}
        ],
        TEXTURES_CREATED: () => { },
        RENDER_CACHE: (p: string) => p
    }
});

//Epic
const { renderer: { renderProfile, renderBatch, renderComplete, texturesCreated } } = actions;
export const renderNodes: Epic<FSA, any> =
    (action$, store) => action$
        .ofType(TRANSFER_COMPLETE)
        .switchMap(({ payload }) => {
            const { canvasCache: {cacheKey} } = store.getState();
            return concat(
                drawNodes({ nodes: payload, cacheKey }).map(renderBatch),
                of(renderComplete())
            )
        });

export const createTextures: Epic<FSA, any> =
    action$ => action$
        .ofType(PROFILE_LOADED)
        .map(({ payload: { nodeTypes } }) => {
            createColorGenerator(nodeTypes);
            return texturesCreated();
        });

const { heap: { applyFilters: af } } = heapActions;
const { renderer: { renderCache: rc } } = actions;
export const renderIfCached: Epic<FSA, any> =
    (action$, store) => action$
        .ofType(SUBMIT_FILTERS)
        .mergeMap(({ payload, payload: { filters, samples } }) => {
            const key = toCacheKey(payload)
            if (getCanvases(key)) {
                renderCache(key);
                return concat(of(rc(key)), of(renderComplete()));
            }
            return of(af({ filters, samples, width: getWidth() * 2 }));
        });