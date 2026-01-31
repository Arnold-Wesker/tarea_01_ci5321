import * as twgl from "twgl.js";

const gl = document.querySelector("#c").getContext("webgl2");
if (!gl) throw new Error("WebGL2 no disponible");

const vs = `#version 300 es
in vec2 a_position;
in vec3 a_color;
uniform float u_aspect;
out vec3 v_color;
void main() {
  vec2 p = a_position;
  p.x /= u_aspect;                 // evita que se vea “ancho” en pantallas wide
  gl_Position = vec4(p, 0.0, 1.0);
  v_color = a_color;
}`;

const fs = `#version 300 es
precision highp float;
in vec3 v_color;
out vec4 outColor;
void main() {
  outColor = vec4(pow(v_color, vec3(1.0/2.2)), 1.0);
}`;

const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
  a_position: { numComponents: 2, data: [-0.5,0,  0.5,0,  0,0.87] },
  a_color:    { numComponents: 3, data: [ 0,1,0,  0,0,1,  1,0,0 ] }, 
});

function draw() {
  twgl.resizeCanvasToDisplaySize(gl.canvas, Math.min(devicePixelRatio || 1, 2));
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(27/255, 30/255, 43/255, 1); 
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, { u_aspect: gl.canvas.width / gl.canvas.height });
  twgl.drawBufferInfo(gl, bufferInfo);
}

addEventListener("resize", draw);
draw();
