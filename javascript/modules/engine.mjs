import {draw} from "./ui.mjs";
import {notifyAll, notify, cancelNotify} from "./renderer.mjs";
import {setStatus} from "./ui/engine.mjs";
import {vec2} from "./vectors.mjs";

import {boundaries} from "./engine/boundaries.mjs"

// ================= DISCLAIMER =====================
// This guy gotta run FAST, headaches due to unreadable
// code might be experienced here.

// Big ass object to store our CA data in
export const map = {
  "size": undefined,
  "states": [],
  "boundary": 0,
  "data": {
    "states": undefined,
    "actions": undefined
  }
};

export const meta = {
  "initial": undefined,
  "interval": undefined,
  "generation": 0,

  "sleep": 0,
  "target": undefined,
  "current": undefined,

  "start": new vec2(0, 0),
  "stop": new vec2(0, 0),
  "range": undefined,

  "boundary": undefined,
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

  meta.range = new vec2(map.size[0], map.size[1]);

  // Save a copy of the starting states for reset.
  meta.initial = JSON.parse(JSON.stringify(map.data.states));

  meta.boundary = boundaries[map.boundary];

  meta.interval = setInterval(() => step(), meta.sleep);
}

// Step one generation
export function step() {
  if(meta.target != undefined && meta.generation >= meta.target) {
    // Done with this simulation. Stop everything.
    clearInterval(meta.interval);

    cancelNotify();
    notifyAll();

    draw();

    setStatus("Done. ", meta.generation);
    return;
  }

  const evalTime = evalActions();
  meta.generation++;
  // No need to draw if immediately overwritten...
  if(meta.sleep > 0) draw();
  setStatus("Running. Delta: " + evalTime + " ms, ", meta.generation);
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
function evalActions() {
  const start = new Date().getTime();
  // This will be our working copy.
  meta.current = JSON.parse(JSON.stringify(map.data.states)); // Make a deep copy
  // Iterate over the cells and evaluate actions
  for(let i = 0; i < map.size[0]; i++)
    for(let j = 0; j < map.size[1]; j++) {
      // Iterate over each action for this cell
      const actions = map.data.actions[i][j];

      for(let k = 0; k < actions.length; k++) {
        if(actions[k].target == action.TARGET_NEIGHBOR)
          evalNeighborhood(i, j, actions[k]);
        else
          evalOne(i, j, actions[k]);
      }
    }

  // All is done. Just make the new states drawable and move on.
  map.data.states = meta.current;
  const end = new Date().getTime();
  // Return time elapsed while evaluating this generaiton.
  return (end - start);
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
  meta.start.set(x - act.distance, y - act.distance);
  meta.stop.set(x + act.distance, y + act.distance);

  meta.boundary();

  const width = meta.range[0];
  const height = meta.range[1];

  let count = 0;
  for(let i = meta.start[0]; i <= meta.stop[0]; i++) {
    for(let j = meta.start[1]; j <= meta.stop[1]; j++) {
      if(x == i && y == j)
        continue;

      if(map.data.states[(map.size[0] + i) % map.size[0]]
        [(map.size[1] + j) % map.size[1]] == act.test)
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
