import {draw} from "./ui.mjs";
import {notifyAll, notify} from "./renderer.mjs";
import {setStatus} from "./ui/engine.mjs";

// ================= DISCLAIMER =====================
// This guy gotta run FAST, headaches due to unreadable
// code might be experienced here.

// Big ass object to store our CA data
export const map = {
  "size": undefined,
  "states": [],
  "data": {
    "states": undefined,
    "actions": undefined
  }
};

const meta = {
  "initial": undefined,
  "interval": undefined,
  "generation": 0,

  "sleep": 0,
  "target": undefined,
  "current": undefined
}

// Enum for action configuration
export const action = {
  "TARGET_NEIGHBOR": 0,
  "TARGET_ONE": 1,

  "MODE_IS": 0,
  "MODE_NOT": 1,
  "MODE_LESS": 2,
  "MODE_MORE": 3
}

export function start(target = undefined, sleep = 0) {
  meta.sleep = sleep;
  meta.target = target;
  // Save a copy of the starting states for reset.
  meta.initial = JSON.parse(JSON.stringify(map.data.states));
  meta.interval = setInterval(() => step(), meta.sleep);
}

// Step one generation
export function step() {
  const delta = advance();
  meta.generation++;

  if(meta.target != undefined && meta.generation >= meta.target) {
    // Done with this simulation. Stop everything.
    clearInterval(meta.interval);

    setStatus("Done. ", meta.generation);
    draw();
    return;
  } else setStatus("Running. Delta: " + delta + " (ms), ", meta.generation);

  if(meta.sleep > 0) draw(); // No need to draw if immediately overwritten...
}

// Stop engine
export function stop() {
  clearInterval(meta.interval);
  notifyAll();

  setStatus("Stopped. ", meta.generation);
}

export function reset() {
  // Back from the beginning.
  meta.generation = 0;
  // We may have some crap data from older simulations. Clean it up.
  if(meta.initial != undefined) {
    map.data.states = meta.initial;
    meta.initial = undefined;
  }
  notifyAll();

  setStatus("Ready.");
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
  meta.current = JSON.parse(JSON.stringify(map.data.states)); // Make a deep copy
  for(let i = 0; i < map.size[0]; i++)
    for(let j = 0; j < map.size[1]; j++)
      // Just iterate over all cells and evaluate one by one.
      evalCellActions(i, j);

  // All is done. Just make the new states drawable and move on.
  map.data.states = meta.current;
  const end = new Date().getTime();
  // Return time elapsed while evaluating this generaiton.
  return (end - start);
}

function evalCellActions(x, y) {
  // Actions are actions: don't care if we get them from the original data.
  const actions = map.data.actions[x][y];
  for(let k = 0; k < actions.length; k++) {
    switch(actions[k].target) {
      case action.TARGET_NEIGHBOR:
        evalNeighborhood(x, y, actions[k]);
        break;
      case action.TARGET_ONE:
        evalOne(x, y, actions[k]);
        break;
    }
  }
}

function evalOne(x, y, act) {
  // The trick is here: compare the state from map.data!!!
  const other = map.data.states[act.other[0]][act.other[1]];
  // This is easy. Just select our mode and
  if(compare(act.mode, other, act.test)) {
    // And change states in current!!! Hopefully this works
    meta.current[x][y] = act.new;
    if(meta.sleep > 0) notify(x, y);
  }
}

function evalNeighborhood(x, y, act) {
  // Vectors make the GC go nuts, let's not use 'em here...

  // Calculate the boundaries of this cell's neighborhood
  // If they exceed our grid's limits cap them.

  // This is not going to stay here forever
  let xStart = x - act.distance;
  let yStart = y - act.distance;
  xStart = (xStart >= 0) ? xStart : 0;
  yStart = (yStart >= 0) ? yStart : 0;

  let xEnd = x + act.distance;
  let yEnd = y + act.distance;
  xEnd = (xEnd < map.size[0]) ? xEnd : map.size[0] - 1;
  yEnd = (yEnd < map.size[1]) ? yEnd : map.size[1] - 1;

  // Check neighboirng cells and increase count when finding a matching one
  let count = 0;
  for(let i = xStart; i <= xEnd ; i++) {
    for(let j = yStart; j <= yEnd; j++) {
      if(x == i && y == j)
        continue;
      if(map.data.states[i][j] == act.test)
        count++;
    }
  }

  if(compare(act.mode, count, act.threshold)) {
    meta.current[x][y] = act.new;
    if(meta.sleep > 0)
      notify(x, y);
  }
}

// Variable operator, pretty cool
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
