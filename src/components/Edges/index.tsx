import * as React from 'react';
import './Edges.pcss';
import Stats from '../Stats';
import { Node } from '../../services/worker/heap-profile-parser';
import * as filesize from 'filesize';

interface Edge {
    edgeIndex: number;
    name: string;
    node: Node;
    type: string;
}

interface EdgesProps {
    edges: any;
}

interface Stats {
    name: string;
    type: string;
    nodeName: string;
    nodeRetainedSize: string;
    nodeSelfSize: string;
    nodeType: string;
    [key: string]: string | number;
}

function edgeToStats(edge:Edge) {
    const { name, type, node: { name: nodeName, type: nodeType, retainedSize: nodeRetainedSize, selfSize: nodeSelfSize } } = edge;

    return {
        name,
        type,
        nodeName,
        nodeRetainedSize:filesize(nodeRetainedSize),
        nodeSelfSize:filesize(nodeSelfSize),
        nodeType
    }
}

export const Edges = ({ edges }: EdgesProps) => {
    const renderEdges = edges.sort((a: Edge, b: Edge) => {
        const { node: { retainedSize: aSize } } = a;
        const { node: { retainedSize: bSize } } = b;
        if (aSize > bSize) return -1
        if (bSize > aSize) return 1;
        return 0;
    }).slice(0, 10).map(edgeToStats);
    return (
        <div className="Edges">
            <strong>Edges:</strong>
            {renderEdges.map((edge: Stats) => <Stats stats={edge} />)}
        </div>
    )
};

export default Edges;