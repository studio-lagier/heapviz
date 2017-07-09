import * as React from 'react';
import './ThumbnailPanels.pcss';
import Image from '../Image';

interface ThumbnailPanelsProps {
    click: Function;
}

export const ThumbnailPanels = ({click}:ThumbnailPanelsProps) => (
    <div className="ThumbnailPanels">
        <h3>Choose a pre-loaded heap timeline below</h3>
        <div className="panels">
            <a onClick={() => click('small')}>
                <Image src="/thumbnails/small.png" />
            </a>
            <a onClick={() => click('medium')}>
                <Image src="/thumbnails/medium.png" />
            </a>
            <a onClick={() => click('large')}>
                <Image src="/thumbnails/large.png" />
            </a>
        </div>
    </div>
);

export default ThumbnailPanels;
