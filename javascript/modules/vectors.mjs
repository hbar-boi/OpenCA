
// Need some way of passing vectors around

export function getVec2(vec) {
  return new vec3(vec[0], vec[1], 0);
}

export function vec2(x, y) {
  return new vec3(x, y, 0);
}

export function getVec3(vec) {
  return new vec3(vec[0], vec[1], vec[2]);
}

export function vec3(x, y, z) {
  this[0] = +x;
  this[1] = +y;
  this[2] = +z;

  this.sub = function(other) {
    this[0] -= other[0];
    this[1] -= other[1];
    this[2] -= other[2];

    return this;
  }

  this.add = function(other) {
    this[0] += other[0];
    this[1] += other[1];
    this[2] += other[2];

    return this;
  }

  this.equals = function(other) {
    if(!other) return false;
    return (this[0] == other[0]) &&
      (this[1] == other[1]) &&
      (this[2] == other[2]);
  }

  this.toRGBA = function() {
    return "rgba(" +
      this[0] + ", " +
      this[1] + ", " +
      this[2] + ", 255)";
  }

  this.clone = function() {
    return new vec3(this[0], this[1], this[2]);
  }

  return this;
}
