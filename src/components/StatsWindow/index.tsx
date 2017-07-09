import * as React from 'react';
import './StatsWindow.pcss';
import Stats from '../Stats';
import * as filesize from 'filesize';

interface StatsWindowProps {
    stats: any;
    length: number;
}

function getSizes(totals:any) {
    return Object.keys(totals).reduce((all:any, key) => {
        all[key] = filesize(totals[key])
        return all;
    }, {})
}

export const StatsWindow = ({ stats, length }: StatsWindowProps) => {
    const renderStats = Object.assign({
        ["Number of nodes"]: length,
        ["Number of samples"]: stats.samples.length
    }, getSizes(stats.totals));

    return (
        <div className="StatsWindow module">
            <h3>Profile stats</h3>
            <Stats stats={renderStats} />
        </div>
    )
};

export default StatsWindow;