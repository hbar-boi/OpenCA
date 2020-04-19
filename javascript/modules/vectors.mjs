

export function vec2(x, y) {
  return new vec3(x, y, 0);
}

export function vec3(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.sub = function(other) {
    add(other.neg());

    return this;
  }

  this.add = function(other) {
    this.x = this.x + other.x;
    this.y = this.y + other.y;
    this.z = this.z + other.z;

    return this;
  }

  this.neg = function() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
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

  return this;
}
