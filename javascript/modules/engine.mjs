
// Big ass object to store our CA data
export const map = {
  "grid": {
    "x": 0,
    "y": 0
  },
  "canvas": {
    "top": 0,
    "left": 0,
    "width": 0,
    "height": 0,
    "disabled": false
  },
  "cell": {
    "size": 0,
    "margin": 0,
    "hover": undefined,
    "focus": undefined,
    "target": undefined
  },
  "states": [],
  "data": []
};

// Enum for action configuration
export const action = {
  "TARGET_NEIGHBOR": 0,
  "TARGET_ONE": 1,

  "MODE_IS": 0,
  "MODE_NOT": 1,
  "MODE_LESS": 2,
  "MODE_MORE": 3
}
