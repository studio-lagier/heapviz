import * as React from 'react';
import { EventHandler, ChangeEvent, Component } from 'react';
import './SelectFilter.pcss';

interface SelectFilterProps {
    value: string|number;
    onChange: EventHandler<ChangeEvent<HTMLSelectElement>>;
    nodeTypes: string[];
}

export class SelectFilter extends React.Component<SelectFilterProps, {}> {
    render() {
        const { onChange, value, nodeTypes } = this.props;
        return (<div className="SelectFilter">
            <strong>Type</strong>
            <select onChange={onChange} value={value}>
                <option value="all">all</option>
                {
                    nodeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))
                }
            </select>
        </div>)
    }
}

export default SelectFilter;
