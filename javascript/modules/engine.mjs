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
  "data": {
    "states": undefined,
    "actions": undefined
  }
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

let initial = undefined;
let interval = undefined;
let generation = 0;

export function start(target = undefined, sleep = 0) {
  // Save a copy of the starting states for reset.
  initial = JSON.parse(JSON.stringify(map.data.states));
  interval = setInterval(function() {
    const delta = advance();
    generation++;
    if(sleep > 0) draw(); // No need to draw if immediately overwritten...
    if(target != undefined && generation >= target) {
      // Done with this simulation. Stop everything.
      clearInterval(interval);
      setStatus("Done. ", true);
      $("#engine-status").html("Done. Generation: " + generation);
      draw();
    } else setStatus("Running. Delta: " + delta + " (ms), ", true);
  }, sleep);
}

// Step one generation
export function step() {
  advance();
  generation++;
  draw();
}

// Stop engine
export function stop() {
  clearInterval(interval);
  setStatus("Stopped. ", true);
}

export function reset() {
  // Back from the beginning.
  generation = 0;
  // We may have some crap data from older simulations. Clean it up.
  if(initial != undefined) {
    map.data.states = initial;
    initial = undefined;
  }
  setStatus("Ready.", false);
}

function setStatus(before, gen) {
  const container = $("#engine-status");
  container.html(before);
  if(gen) container.append("Generation: " + generation);
}

// STRATEGY. Since we want to compare ALL cells at the same time
// we may have a problem: what if a cell that was red has been turned
// into a white one by an action before the one we are evaluating right now?
// The newer action mightn't fire and that ain't good. To fix this we just make
// a "working" copy of our cell data and change THAT one. All comparisons will
// be made on the original one (map.data) while the state changes happen on the
// copy. At the end we just overwrite the working one on the old data.
function advance() {
  const start = new Date().getTime();
  // This will be our working copy. We could just as well pass the states only.
  const current = JSON.parse(JSON.stringify(map.data.states)); // Make a deep copy
  for(let i = 0; i < map.grid.x; i++) {
    for(let j = 0; j < map.grid.y; j++) {
      // Just iterate over all cells and evaluate one by one.
      evalCellActions(new vec2(i, j), current);
    }
  }
  // All is done. Just make the new states drawable and move on.
  map.data.states = current;
  const end = new Date().getTime();
  // Return time elapsed while evaluating this generaiton.
  return (end - start);
}

function evalCellActions(cell, current) {
  // Actions are actions: don't care if we get them from the original data.
  const actions = map.data.actions[cell.x][cell.y];
  actions.forEach(function(item, i) {
    const mode = item.mode;
    switch(item.target) { // Identify action target
      case action.TARGET_NEIGHBOR:
        evalNeighborhood(cell, item, current);
        break;
      case action.TARGET_ONE:
        evalOne(cell, item, current)
        break;
    }
  });
}

function evalOne(cell, act, current) {
  // The trick is here: compare the state from map.data!!!
  const other = map.data.states[act.other.x][act.other.y];
  // This is easy. Just select our mode and
  if(compare(act.mode, other, act.test))
    // And change states in current!!! Hopefully this works
    current[cell.x][cell.y] = act.new;
}

function evalNeighborhood(cell, act, current) {
  const boundaries = new vec2(act.distance, act.distance);

  // Calculate the boundaries of this cell's neighborhood
  // If they exceed our grid's limits cap them.
  const start = new vec2(cell).sub(boundaries);
  start.x = (start.x >= 0) ? start.x : 0;
  start.y = (start.y >= 0) ? start.y : 0;
  const end = new vec2(cell).add(boundaries);
  end.x = (end.x < map.grid.x) ? end.x : map.grid.x - 1;
  end.y = (end.y < map.grid.y) ? end.y : map.grid.y - 1;

  // Check neighboirng cells and increase count when finding a matching one
  let count = 0;
  for(let i = start.x; i <= end.x ; i++) {
    for(let j = start.y; j <= end.y; j++) {
      if(cell.x == i && cell.y == j) continue;
      if(map.data.states[i][j] == act.test)
        count++;
    }
  }

  if(compare(act.mode, count, act.threshold))
    current[cell.x][cell.y] = act.new;
}

// Variable operator, not bad...
function compare(mode, first, second) {
  switch(mode) {
    case action.MODE_IS:
      return first == second;
    case action.MODE_NOT:
      return first != second;
    case action.MODE_LESS:
      return first < second;
    case action.MODE_MORE:
      return first > second;
  }
}
