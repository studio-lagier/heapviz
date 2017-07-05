import * as React from 'react';
import { connect } from 'react-redux';
import './SampleSelector.pcss';

interface Sample {
    nodeCount: number;
    totalSize: number;
}

interface SampleSelectorProps {
    samples: Sample[];
}

export const SampleSelector = ({ samples }:SampleSelectorProps) => {
    return (
        <div className="SampleSelector">

        </div>
    )
};

export default connect(({ samples: { stats: { samples } } }) => {
    return {samples}
 })(SampleSelector);
