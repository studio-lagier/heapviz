import * as React from 'react';
import './Image.pcss';

interface ImageProps {
    src: string;
}

export const Image = ({ src }:ImageProps) => (
    <div className="Image">
        <img src={src} {...this.props} />
    </div>
);

export default Image;
