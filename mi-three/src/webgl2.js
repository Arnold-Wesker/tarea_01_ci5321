const canvas = document.querySelector("#c");
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("WebGL2 no disponible");

const vs = `#version 300 es
layout(location=0) in vec2 a_position;
layout(location=1) in vec3 a_color;

uniform float u_aspect;

out vec3 v_color;

void main() {
  vec2 p = a_position;
  p.x /= u_aspect;
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

function makeProgram(vsSrc, fsSrc) {
  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vsSrc));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fsSrc));
  gl.linkProgram(p);
  return p;
}

const program = makeProgram(vs, fs);

const data = new Float32Array([
  -0.5, 0.0,  0,1,0,  
   0.5, 0.0,  0,0,1,  
   0.0, 0.87, 1,0,0,  
]);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

const stride = 5 * 4;   
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0);

gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 2 * 4);

gl.bindVertexArray(null);

function draw() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const w = Math.floor(canvas.clientWidth * dpr);
  const h = Math.floor(canvas.clientHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w; canvas.height = h;
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(27/255, 30/255, 43/255, 1); 
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  const uAspectLoc = gl.getUniformLocation(program, "u_aspect");
  gl.uniform1f(uAspectLoc, canvas.width / canvas.height);

  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.useProgram(program);
  gl.bindVertexArray(vao);
  gl.bindVertexArray(null);
}

window.addEventListener("resize", draw);
draw();
