import * as React from 'react';
import './Stats.pcss';

interface StatsProps {
    stats: { [key: string]: string | number }
}

export const Stats = ({ stats }: StatsProps) => {
    return (
        <div className="Stats">
        {Object.keys(stats).map(name => (
            <div className="stat" key={name}>
                <span className="name">{name}: </span>
                <span className="value">{stats[name]}</span>
            </div>
        ))}
        </div>
    )
};

export default Stats;