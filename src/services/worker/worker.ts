import * as _ from 'lodash';
import { vsprintf } from './lib/vsprintf';
(<any>self).vsprintf = vsprintf;

import { WebInspector } from './web-inspector';
import { Node, WireNode, Dispatcher, HeapProfile } from './heap-profile-parser';
import { Observable } from 'rxjs';
import { FilterState, initialFilters } from '../filters/state';

importScripts('/pack-circles/index.js');
declare var Module: any;

import {
    SEND_NODES,
    PROGRESS_UPDATE,
    NODE_FETCHED,
    PROFILE_LOADED,
    TRANSFER_COMPLETE,
    TRANSFER_PROFILE,
    APPLY_FILTERS,
    FETCH_NODE
} from './messages';

//Returns FSA actions for cosnu
import { FluxStandardAction } from '../../../typings/fsa';

const { fromEvent } = Observable;
const dispatcher = new Dispatcher(self, self.postMessage.bind(self));
let heapProfile: HeapProfile;
const MAX_NODES = 10000000;

function serializeResponse(nodes: Array<WireNode>) {
    const te = new TextEncoder();
    return te.encode(JSON.stringify(nodes)).buffer;
}

function transferNodes(children: Array<Node>, nodes: any) {
    let node:WireNode;
    const wireNodes:WireNode[] = [];
    for (var i = 0; i < nodes.size(); i++) {
        node = children[i].toMed();
        node.x = nodes.get(i).x;
        node.y = nodes.get(i).y;
        node.r = nodes.get(i).r;
        wireNodes.push(node);
    }

    const ab = serializeResponse(wireNodes);
    dispatcher.sendEvent(SEND_NODES, ab, [ab], {message: 'Nodes have transferred, rendering!'});
}

function fromHeap(heap: ArrayBufferView) {
    const decoder = new TextDecoder();
    const file = decoder.decode(heap);
    const profile = new HeapProfile(JSON.parse(file), dispatcher);
    return profile;
}

interface ProfilePayload {
    heap: ArrayBufferView;
    width: number;
}
function receiveProfile({ heap, width }: ProfilePayload) {
    dispatcher.sendEvent(PROGRESS_UPDATE, 'Generating samples...');
    heapProfile = fromHeap(heap);
    dispatcher.sendEvent(PROGRESS_UPDATE, 'Generating statistics...');
    const stats = heapProfile.fetchStats();
    dispatcher.sendEvent(PROGRESS_UPDATE, 'Transferring data from worker...');

    dispatcher.sendEvent(PROFILE_LOADED, {
        stats,
        nodeTypes: heapProfile.snapshot._nodeTypes
    }, undefined, {message: 'Profile has loaded'});

    const children = getNodes(initialFilters, 0);
    if (!children) return;

    dispatcher.sendEvent(PROGRESS_UPDATE, 'Calculating layout. If this is taking a long time, please increase the filter');
    const nodes = generateLayout(children, width);

    transferNodes(children, nodes);
    dispatcher.sendEvent(TRANSFER_COMPLETE);
}

function getNodes(filters: FilterState, idx: number) {
    const nodes = heapProfile.applyFilters({ filters, idx });
    if (nodes.length > MAX_NODES) {
        dispatcher.sendEvent(PROGRESS_UPDATE, `Current filter contains ${nodes.length} nodes, max nodes is ${MAX_NODES}. Please increase filter to reduce number of visible nodes`);
        return;
    }

    return nodes;
}

function generateLayout(children: Node[], width: number) {
    let root;

    root = new Module.Hierarchy({
        size: [width, width],
        padding: 1.5
    }, { value: 0, children: children.map(node => node.toSmall())});

    return root.pack().leaves();
}

function applyFilters(
    { filters, idx, width }:
        { filters: FilterState, idx: number, width: number }
) {
    //Send samples across in chunks here
    const children = getNodes(filters, idx);

    const nodes = generateLayout(children, width);

    transferNodes(children, nodes);
    dispatcher.sendEvent(TRANSFER_COMPLETE);
}

function fetchNode(idx:number) {
    const node = heapProfile.fetchNode(idx);
    dispatcher.sendEvent(NODE_FETCHED, { idx, node });
}

interface HeapWorkerMessageEvent extends MessageEvent {
    data: FluxStandardAction<any, any>
}

const source = fromEvent(self, 'message');
const subscription = source.subscribe((e: HeapWorkerMessageEvent) => {
    const { data: {type, payload} } = e;
    switch (type) {
        case TRANSFER_PROFILE:
            receiveProfile(payload);
            break;
        case APPLY_FILTERS:
            applyFilters(payload);
            break;
        case FETCH_NODE:
            fetchNode(payload);
            break;
    }
});

export default self;