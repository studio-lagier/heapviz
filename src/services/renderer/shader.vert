precision mediump float;

attribute vec2 aPosition;

uniform mat4 uModelView;
uniform mat4 uProjection;

void main() {
  gl_Position = uProjection * uModelView * vec4(aPosition, 0.0, 1.0);
}