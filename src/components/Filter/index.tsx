import * as React from 'react';
import { EventHandler, ChangeEvent } from 'react';
import './Filter.pcss';

interface FilterProps {
    type: string;
    value: string|number;
    onChange: EventHandler<ChangeEvent<HTMLInputElement>>;
}

export const Filter = ({ type, value, onChange }:FilterProps) => {
    return (
        <div className="Filter">
            <strong>{type}</strong>
            <input value={value} onChange={onChange} type="number"/>
        </div>
    )
};

export default Filter;
