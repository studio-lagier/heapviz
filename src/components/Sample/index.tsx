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

export class Sample extends React.Component<SampleProps, {}> {
    getHeight(sample: iSample, total: number, maxHeight: number) {
        return Math.ceil((sample.totalSize / total) * maxHeight);
    }
    render() {
        const { sample, total, maxHeight, width, left, selected } = this.props;
        return (
            <div className={`Sample ${selected ? 'selected' : ''}`} style={{
                height: this.getHeight(sample, total, maxHeight),
                width,
                left
            }}/>
        )
    }
};

export default Sample;
