
// Need some way of passing vectors around

export const components = {
  "COMPONENT_X": 0,
  "COMPONENT_Y": 1,
  "COMPONENT_Z": 2
};

export function vec2(...args) {
  if(args.length > 1) return new vec3(args[0], args[1], 0);
  else return new vec3(args[0].x, args[0].y, 0);
}


export function vec3(...args) {
  if(args.length > 1) {
    this.x = +args[0];
    this.y = +args[1];
    this.z = +args[2];
  } else {
    this.x = +args[0].x;
    this.y = +args[0].y;
    this.z = +args[0].z;
  }


  this.sub = function(other) {
    this.add(other.neg());

    return this;
  }

  this.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;

    return this;
  }

  this.neg = function() {
    const res = new vec3(
      -this.x,
      -this.y,
      -this.z
    );

    return res;
  }

  this.dot = function(other) {
    const res = (this.x * other.x) + (this.y * other.y) + (this.z * other.z);
    return res;
  }

  this.cross = function(other) {
    const res = new vec3(
      (this.y * other.z) - (this.z * other.y),
      (this.z * other.x) - (this.x * other.z),
      (this.x * other.y) - (this.y * other.x)
    );
    return res;
  }

  this.equals = function(other) {
    if(other === undefined) return false;
    const res = (this.x == other.x) && (this.y == other.y) && (this.z == other.z);
    return res;
  }

  this.copy = function() {
    return new vec3(this.x, this.y, this.z);
  }

  this.toRGBA = function() {
    const res = "rgba(" + this.x + ", " + this.y + ", " + this.z + ", 255)";
    return res;
  }

  return this;
}
