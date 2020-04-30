import {vec2, vec3} from "./vectors.mjs";
import {draw} from "./ui.mjs";

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

let interval = undefined;
let initial = undefined;
let generation = 0;

export function start(target = undefined, sleep = undefined) {
  map.canvas.disabled = true;
  draw();
  interval = setInterval(function() {
    advance();
    generation++;
    if(sleep > 0) draw();
    if(target != undefined && generation >= target)
      clearInterval(interval);
  }, sleep == undefined ? 0 : sleep);
}

export function step() {
  advance();
  generation++;
  draw();
}

export function stop() {
  map.canvas.disabled = false;
  clearInterval(interval);
  draw();
}

export function reset() {
  // Back from the beginning.
  generation = 0;
  // We may have some crap data from older simulations. Clean it up.
  if(initial == undefined) initial = map.data;
  else {
    map.data = initial;
    initial == undefined;
  }
  map.canvas.disabled = false;
  draw();
}

// STRATEGY. Since we want to compare ALL cells at the same time
// we may have a problem: what if a cell that was red has been turned
// into a white one by an action before the one we are evaluating right now?
// The newer action wouldn't fire and that ain't good. To fix this we just make
// a "working" copy of our cell data and change THAT one. All comparisons will
// be made on the original one (map.data) while the state changes happen on the
// copy. At the end we just overwrite the working one on the old data.
function advance() {
  // This will be our working copy. We could just as well pass the states only.
  const current = JSON.parse(JSON.stringify(map.data)); // Make a deep copy
  for(let i = 0; i < map.grid.x; i++) {
    for(let j = 0; j < map.grid.y; j++) {
      // Just iterate over all cells and evaluate one by one.
      evalCellActions(new vec2(i, j), current);
    }
  }
  // All is done. Just make the new states drawable and move on.
  map.data = current;
  draw();
}

function evalCellActions(cell, current) {
  // Actions are actions: don't care if we get them from the original data.
  const actions = map.data[cell.x][cell.y].actions;
  actions.forEach(function(item, i) {
    const mode = item.mode;
    switch(item.target) { // Identify action target
      case action.TARGET_NEIGHBOR:
        evalNeighbor(cell, item, current);
        break;
      case action.TARGET_ONE:
        evalOne(cell, item, current)
        break;
    }
  });
}

function evalOne(cell, act, current) {
  // The trick is here: compare the state from map.data!!!
  const other = map.data[act.other.x][act.other.y].state;
  // This is easy. Just select our mode and
  if((act.mode == action.MODE_IS && other == act.test) ||
    (act.mode == action.MODE_NOT && other != act.test))
    // And change states in current!!! Hopefully this works
    current[cell.x][cell.y].state = act.new;
}

function evalNeighbor(cell, act, current) {
  const boundaries = new vec2(act.distance, act.distance);
  const start = new vec2(cell).sub(boundaries);
  const end = new vec2(cell).add(boundaries);
  let count = 0;
  for(let i = start.x; i <= end.x; i++) {
    for(let j = start.y; j <= end.y; j++) {
      if(map.data[i][j].state == act.test) count++;
    }
  }
  // Jeez - Variable operator needed asap
  if((act.mode == action.MODE_IS && count == act.threshold) ||
    (act.mode == action.MODE_NOT && count != act.threshold) ||
    (act.mode == action.MODE_LESS && count < act.threshold) ||
    (act.mode == action.MODE_MORE && count > act.threshold))
    current[cell.x][cell.y].state = act.new;
}
