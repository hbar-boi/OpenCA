class Shader {

  constructor(gl) {
    const vertexSource = `
      attribute vec4 aVertexPosition;

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      void main() {
        vec4 clip = (aVertexPosition * vec4(2.0, 2.0, 1.0, 1.0)) - vec4(1.0, 1.0, 0.0, 0.0);
        gl_Position = uProjectionMatrix * uModelViewMatrix * clip;
      }
    `;

    const fragSource = `
      void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
    `;

    this.program = gl.createProgram();

    let vertex = this.load(gl, gl.VERTEX_SHADER, vertexSource);
    let frag = this.load(gl, gl.FRAGMENT_SHADER, fragSource);

    gl.attachShader(this.program, vertex);
    gl.attachShader(this.program, frag);
    gl.linkProgram(this.program);

    this.meta = {
      program: this.program,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(this.program, 'aVertexPosition'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(this.program, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(this.program, 'uModelViewMatrix'),
      },
    };
  }

  load(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return shader;
  }
}
