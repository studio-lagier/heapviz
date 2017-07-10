import { schemeCategory20 as scheme, scaleOrdinal as scale } from 'd3-scale';

let _colorGenerator: (type: string) => number[];

export function padHex(base: string[]) {
    const hex = "000000".split('');
    hex.splice(-base.length, base.length, ...base);
    return hex.join('');
}

export function hexToColor(hex: string) {
    const digits: number[] = [];
    hex = hex.replace('#', '');
    for (var i = 0; i < 6; i = i + 2) {
        const color = hex.slice(i, i + 2);
        digits.push(parseInt(color, 16)/255);
    }

    return digits;
}

export function colorToHex(color:any) {
    let hex = "";
    color.forEach((el:number) => {
        let elString = el.toString(16);
        if(elString.length === 1) elString = "0" + elString;
        hex += elString;
    });

    return hex;
}

export function createColorGenerator(nodeTypes: string[]) {
    const _colors = scale()
        .domain(nodeTypes)
        .range(scheme);

    _colorGenerator = (type:string) => {
        const hex = <string>_colors(type)
        return hexToColor(hex).concat(1);
    }
}

export function color(type: string) {
    return _colorGenerator(type);
}

export function modifyColor(color: number[], amount: number) {
    return color.map((c, i) => i < 3 ? Math.max(Math.min((1 + amount) * c, 255), 0) : c);
}