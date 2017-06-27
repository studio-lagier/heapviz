import * as glBuffer from 'gl-buffer';
import * as glClear from 'gl-clear';
import * as context from 'gl-context';
import * as glShader from 'gl-shader';
import * as frag from 'raw!./shader.frag';
import * as vert from 'raw!./shader.vert'
import * as create from 'gl-mat4/create';
import * as identity from 'gl-mat4/identity';
import * as translate from 'gl-mat4/translate';
import * as scale from 'gl-mat4/scale';
import * as ortho from 'gl-mat4/ortho';

const projectionMatrix = create();
const matrix = create();

export interface GLState {
    cache: any;
    clear: any;
    gl: any;
    shader: any;
}

export interface TwoDState {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}

export interface Circle {
    c: number[],
    s: number[],
    t: number[],
    vertices: any,
    d: number,
    l: number
}

export function initWebGL(canvas: HTMLCanvasElement, bg: number[], options?:any): GLState {
    const cache = {};
    const clear = glClear({ color: bg });
    const gl = context(canvas, Object.assign({
        premultipliedAlpha: false,
        alpha: false,
        antialias: true
    }, options));

    const shader = glShader(gl, vert, frag);
    shader.attributes.aPosition.location = 0;

    var width = gl.drawingBufferWidth;
    var height = gl.drawingBufferHeight;

    clear(gl);

    gl.viewport(0, 0, width, height);
    ortho(projectionMatrix, 0, width, height, 0, 0, 1);

    shader.bind();
    shader.uniforms.uProjection = projectionMatrix;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    return { cache, clear, gl, shader };
}

export function init2d(canvas: HTMLCanvasElement): TwoDState {
    return {
        canvas,
        ctx: canvas.getContext('2d')
    }
}

//Radius, scale, color
export function circle(r: number, s: number, c: number[], state: GLState): Circle {
    const { cache, gl } = state;
    if (!cache[s]) {
        var e = s + 2;
        var fan = new Float32Array(e * 2);
        var pi2 = 2 * Math.PI;
        var j = 0;

        fan[j++] = 0;
        fan[j++] = 0;

        for (var i = 0; i <= e; i++) {
            fan[j++] = Math.cos(i * pi2 / s);
            fan[j++] = Math.sin(i * pi2 / s);
        }

        cache[s] = glBuffer(gl, fan);
    }

    return {
        c,
        s: [r, r, 0],
        t: [0, 0, 0],
        vertices: cache[s],
        d: gl.TRIANGLE_FAN,
        l: s + 2
    };
}

export function update(objects: any[], state: GLState) {
    const { gl, clear, shader } = state;
    clear(gl);

    for (var i = 0; i < objects.length; i++) {
        var o = objects[i];

        identity(matrix);
        translate(matrix, matrix, o.t);
        scale(matrix, matrix, o.s);

        shader.uniforms.uModelView = matrix;
        shader.uniforms.uModelColor = o.c;

        o.vertices.bind();
        shader.attributes.aPosition.pointer();
        gl.drawArrays(o.d, 0, o.l);
    }
}

export function dispose(state: GLState) {
    const { cache, shader } = state;
    Object.keys(cache).forEach(function (k) {
        cache[k].unbind();
        cache[k].dispose();
        delete cache[k];
    });

    shader.dispose();
}

export default { initWebGL, init2d, update, dispose, circle };