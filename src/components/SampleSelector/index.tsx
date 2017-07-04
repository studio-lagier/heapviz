import * as React from 'react';
import { connect } from 'react-redux';
import './SampleSelector.pcss';

interface SampleSelectorProps {
    samples: Sample[];
}

export const SampleSelector = ({ samples }:SampleSelectorProps) => {
    return (
        <div className="SampleSelector">
        </div>
    )
};

export default connect()(SampleSelector);
