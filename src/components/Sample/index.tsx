import * as React from 'react';
import './Sample.pcss';
import { Sample as iSample } from '../../services/samples/state';

interface SampleProps {
    sample: iSample;
    maxHeight: number;
    total: number;
    width: number;
    left: number;
    selected: boolean;
}

function getHeight(sample: iSample, total: number, maxHeight: number) {
    return Math.ceil((sample.totalSize / total) * maxHeight);
}

export const Sample = ({ sample, total, maxHeight, width, left, selected }: SampleProps) => (
    <div className={`Sample ${selected ? 'selected' : ''}`} style={{
        height: getHeight(sample, total, maxHeight),
        width,
        left
    }} />
);

export default Sample;
