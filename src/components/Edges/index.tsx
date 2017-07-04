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
    title: string;
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
    const { name, edgeIndex, type, node: { name: nodeName, type: nodeType, retainedSize: nodeRetainedSize, selfSize: nodeSelfSize } } = edge;

    return {
        id: edgeIndex,
        name,
        type,
        nodeName,
        nodeRetainedSize:filesize(nodeRetainedSize),
        nodeSelfSize:filesize(nodeSelfSize),
        nodeType
    }
}

export const Edges = ({ edges, title }: EdgesProps) => {
    const renderEdges = edges.slice(0, 10).map(edgeToStats);
    return (
        <div className="Edges">
            <strong>{title}:</strong>
            {renderEdges.map((edge: Stats) => <Stats key={edge.id} stats={edge} />)}
        </div>
    )
};

export default Edges;