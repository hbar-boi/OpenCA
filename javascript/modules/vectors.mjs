
// Need some way of passing vectors around

export function getVec2(vec) {
  return new vec2(vec[0], vec[1]);
}

export function vec2(x, y) {
  this[0] = +x;
  this[1] = +y;

  this.set = function(x, y) {
    this[0] = x;
    this[1] = y;

    return this;
  }

  this.sub = function(x, y) {
    this[0] -= x;
    this[1] -= y;

    return this;
  }

  this.add = function(x, y) {
    this[0] += x;
    this[1] += y;

    return this;
  }

  this.equals = function(other) {
    if(!other) return false;
    return (this[0] == other[0]) &&
      (this[1] == other[1]);
  }

  this.clone = function() {
    return new vec2(this[0], this[1]);
  }

  this.clampFloor = function(xMin, yMin) {
    this[0] = (this[0] >= xMin) ? this[0] : xMin;
    this[1] = (this[1] >= yMin) ? this[1] : yMin;

    return this;
  }

  this.clampCeil = function(xMax, yMax) {
    this[0] = (this[0] >= xMax) ? xMax : this[0];
    this[1] = (this[1] >= yMax) ? yMax : this[1];

    return this;
  }

  return this;
}

export function getVec3(vec) {
  return new vec3(vec[0], vec[1], vec[2]);
}

export function vec3(x, y, z) {
  this[0] = +x;
  this[1] = +y;
  this[2] = +z;

  this.toRGBA = function() {
    return "rgba(" +
      this[0] + ", " +
      this[1] + ", " +
      this[2] + ", 255)";
  }

  this.equals = function(other) {
    if(!other) return false;
    return (this[0] == other[0]) &&
      (this[1] == other[1]) &&
      (this[2] == other[2]);
  }

  return this;
}
