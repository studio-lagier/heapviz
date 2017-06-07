import * as _ from 'lodash';
import { Dispatcher, Node } from './index';
import { WebInspector } from '../web-inspector';

interface RawNode {
    [key: string]: any
}

interface RawSample {
    [key: string]: any
}

interface Heap {
    nodes: Array<Node>
}

interface NodeFilter {
    minNodeId: number
    maxNodeId: number
}

export interface Filters {
    type: string
    num: {
        [key: string]: number
    }
}

export class HeapProfile {
    _node: RawNode
    _filter: NodeFilter
    snapshot: any
    nodes: Array<Node>
    samples: Array<Array<Node>>

    constructor(heap: Heap, dispatcher: Dispatcher) {
        //HeapSnapshotProgress accepts a dispatcher with sendEvent method that can receive messages and errors
        // from the heap snapshot generation
        this.snapshot = new WebInspector.JSHeapSnapshot(heap, new WebInspector.HeapSnapshotProgress(dispatcher));
        this._node = this.snapshot.createNode();

        this.createNodes(heap);
        this.createSamples();
    }

    //We're going to avoid creating a tree because of performance implications and instead just create an array of all nodes
    createNodes(heap: Heap) {
        this.nodes = heap.nodes.reduce((all, n, i) => {
            if (i % 6 === 0) {
                const node = this.createNode(i);
                //Filter out the synthetic root node
                if (node.distance > 0) {
                    all.push(node);
                }
            }
            return all;
        }, []);
    }

    createNode(index: number): Node {
        this._node.nodeIndex = index;
        return new Node(this._node);
    }

    createEdges(node: RawNode) {
        this._node.nodeIndex = node.itemIndex;
        const edges = [];
        for (let iter = this._node.edges(); iter.hasNext(); iter.next()) {
            edges.push(iter.edge.serialize());
        }

        return edges.sort((a, b) => {
            const ars = a.node.retainedSize;
            const brs = b.node.retainedSize;
            return ars === brs ? 0 : ars > brs ? 1 : -1;
        });
    }

    //Associate a range of nodes with a particular sample to allow for easy segmentation
    createSamples() {
        this.samples = this.snapshot._samples.timestamps.reduce((all: Array<any>, timestamp: number, idx: number, timestamps: Array<number>) => {
            if (idx > 0) {
                all.push(this.getSample(timestamps[idx - 1] || 0, timestamps[idx]));
            }
            return all;
        }, []);

        return this.samples;
    }

    getSample(startTime: number, endTime: number) {
        //Return a tree made of nodes that exist between startTime and endTime
        //Assumes find iterates in order
        const samples = this.snapshot._samples;
        const startIdx = samples.timestamps.findIndex((timestamp: number) => timestamp >= startTime);
        const endIdx = samples.timestamps.findIndex((timestamp: number) => timestamp > endTime) - 1;

        //Special case startTime 0 to return all initially assigned ids
        const startId = startTime === 0 ? 0 : samples.lastAssignedIds[startIdx];
        const endId = samples.lastAssignedIds[endIdx];

        this._filter = { minNodeId: startId || 0, maxNodeId: endId || this.lastId() };
        return this.nodes.filter(this.inSample.bind(this));
    }

    inSample(node: Node) {
        return _.inRange(node.id, this._filter.minNodeId, this._filter.maxNodeId + 1);
    }

    lastId() {
        const ids = this.snapshot._samples.lastAssignedIds;
        return ids[ids.length - 1];
    }

    fetchNode(nodeIdx: number) {
        const node = this.createNode(nodeIdx);
        node.edges = this.createEdges(node);
        return node;
    }

    fetchStats() {
        return {
            samples: this.samples.map(sample => {
                return {
                    nodeCount: sample.length,
                    totalSize: sample.reduce((total, node) => total + node.selfSize, 0)
                };
            }),
            totals: this.snapshot.getStatistics()
        };
    }

    applyFilters({filters, idx}: {filters: Filters, idx: number}) {
        return this.samples[idx].filter(
            node => {
                if (node.type === 'synthetic') {
                    return false;
                }

                if (filters.type !== 'all' && node.type !== filters.type) {
                    return false;
                }

                return _.reduce(filters.num,
                    (all, val, key) => all && node[key] >= val,
                    true);
            }
        );
    }
};