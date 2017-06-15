// import * as PIXI from 'pixi.js';
// import { schemeCategory20 as scheme, scaleOrdinal as scale } from 'd3-scale';

// interface Textures {
//     [key: string]: any;
// }
// export const textures: Textures = {};

// let _colorGenerator: (color:string) => number;

// export function texture(type:string) {
//   return textures[_colorGenerator(type)]
// }

// //Generate our basic textures
// export function generateTextures(nodeTypes: string[], renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer) {
//     const { view: { width, height } } = renderer;
//     const size = nearestPow2(width < height ? width / 2 : height / 2);
//     _colorGenerator = _colorGenerator || createColorGenerator(nodeTypes);

//     scheme.forEach((hex:string) => {
//         const color = _colorGenerator(hex);
//         textures[color] = createTexture(color, size, renderer);
//     });

//     ['0xF08080', '0x000000', '0xFFFFFF'].forEach(hex => textures[hex] = createTexture(Number(hex), size, renderer));

//     return textures;
// }

// function createColorGenerator(nodeTypes: string[]) {
//     const _colors = scale()
//         .domain(nodeTypes)
//         .range(scheme);

//     return (type:string) => {
//         const hexColor = <string>_colors(type)
//         return Number(hexColor.replace('#', '0x'));
//     }
// }

// function createTexture(hex: number, size: number, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) {
//     const graphic = new PIXI.Graphics();
//     graphic.beginFill(hex);
//     graphic.drawCircle(0, 0, size);
//     const texture = renderer.generateTexture(graphic);
//     texture.baseTexture.mipmap = true;
//     return texture;
// }

// //Shamelessly stolen
// function nearestPow2( aSize: number ){
//   return Math.pow( 2, Math.ceil( Math.log( aSize ) / Math.log( 2 ) ) );
// }
