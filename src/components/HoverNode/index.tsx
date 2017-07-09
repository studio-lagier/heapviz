import * as React from 'react';
import './HoverNode.pcss';
import Stats from '../Stats';
import { Node } from '../../services/worker/heap-profile-parser';
import * as filesize from 'filesize';


interface HoverNodeProps {
    node: any;
}

interface Stats {
    id: number;
    type: string;
    retainedSize: string;
    selfSize: string;
    [key: string]: string | number;
}

function nodeToStats(node: Node):Stats {
    const { d, i, s, v, t, x, y, r } = node;
    return {
        id: i,
        type: t,
        retainedSize: filesize(v),
        selfSize: filesize(s)
    }
}

export const HoverNode = ({ node }: HoverNodeProps) => {
    const stats = nodeToStats(node);
    return (
        <div className="HoverNode module">
            <h3>Hovered Node</h3>
            <Stats stats={stats} />
        </div>
    )
};

export default HoverNode;