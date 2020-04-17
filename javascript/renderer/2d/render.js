class Render {

  constructor(gl, map) {
    this.map = map;
    this.shader = new Shader(gl);

    this.setup(gl); // prepare static VBOs

    this.init(gl); // prepare openGL for drawing

    this.draw(gl);
  }

  setup(gl) { // Construct static map objects
    let parallels = function(n, size, orientation) {
      let margin = (1.0 - (n * size)) / (n - 1);
      let offset = size + margin;

      let indices = [0, 1, 2, 2, 1, 3];
      let out = [[], []];
      for(let i = 0; i < n; i++) {
        if(orientation) {
          out[0] = out[0].concat([
            i*offset, 0.0,
            i*offset, 1.0,
            i*offset+size, 0.0,
            i*offset+size, 1.0
          ]);
        } else {
          out[0] = out[0].concat([
            0.0, i*offset,
            1.0, i*offset,
            0.0, i*offset+size,
            1.0, i*offset+size
          ]);
        }
        out[1] = out[1].concat(
          indices.map(function(a) {
            return 4*i+a;
          }));
      }
      return out;
    }

    let verticals = parallels(map.size.x, map.size.thickness, 1);
    let horizontals = parallels(map.size.y, map.size.thickness, 0);

    let grid = verticals[0].concat(horizontals[0]);

    this.gridBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grid), gl.STATIC_DRAW);

    let gridIndex = verticals[1].concat(
      horizontals[1].map(function(a) {
        return verticals[0].length/2+a
      }));

    this.gridElements = gridIndex.length;

    this.gridIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gridIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(gridIndex), gl.STATIC_DRAW);
  }

  init(gl) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST); // Do depth testing
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.LINE)

    let meta = this.shader.meta;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuffer);
    // Vertex attribute setup
    gl.vertexAttribPointer(
      meta.attribLocations.vertexPosition,
      2, // Vector dimension
      gl.FLOAT, // Vector var type
      false, // Normalization
      0, // Already using 2 as dimension, no stride needed
      0); //Offset from first byte, not needed
    gl.enableVertexAttribArray(meta.attribLocations.vertexPosition);

    gl.useProgram(this.shader.program);

    this.projectionMatrix = glMatrix.mat4.create();
    this.modelViewMatrix = glMatrix.mat4.create();

    gl.uniformMatrix4fv(
      meta.uniformLocations.projectionMatrix,
      false,
      this.projectionMatrix);

    gl.uniformMatrix4fv(
      meta.uniformLocations.modelViewMatrix,
      false,
      this.modelViewMatrix);
  }

  draw(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gridIndexBuffer);
    gl.drawElements(gl.TRIANGLES, this.gridElements, gl.UNSIGNED_SHORT, 0);
  }

}
