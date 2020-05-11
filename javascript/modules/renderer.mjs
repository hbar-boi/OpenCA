import {vec2, vec3} from "./vectors.mjs";
import {colors, cell} from "./ui.mjs";
import {map} from "./engine.mjs";

let updated = [];

// Canvas renderer module, does all the interfacing with ctx

// Draw a single cell, if no color is specified use the cell's
function drawCell(ctx, current, color = undefined) {
  const state = map.data.states[current[0]][current[1]];
  if(!color) color = map.states[state].color;
  const size = cell.size;
  ctx.beginPath();
  ctx.rect(Math.floor(size * current[1]), Math.floor(size * current[0]),
    Math.ceil(size), Math.ceil(size));
  ctx.fillStyle = color.toRGBA();
  ctx.fill();
}

// Draw EVERYTHING
export function draw(ctx) {
  // Iterate and draw cells
  for(let k = 0; k < updated.length; k++) drawCell(ctx, updated[k])
  updated = [];
  // Then overdraw with special ones. Hopefully not too inefficient.
  if(cell.focus) drawCell(ctx, cell.focus, colors.FOCUS_COLOR);
  if(cell.hover) drawCell(ctx, cell.hover, colors.HOVER_COLOR);
  if(cell.target) drawCell(ctx, cell.target, colors.TARGET_COLOR);
}

export function fastNotify(x, y) {
  updated.push([x, y]);
}

export function notifyIfValid(current) {
  if(current) updated.push(current);
}

export function notify(current) {
  if(Array.isArray(current)) updated.push(...current);
  else updated.push(current);
}

export function notifyAll() {
  updated = Array(map.size.x).fill().map(
    (row, i) => Array(map.size.y).fill().map(
      (current, j) => [i, j])).flat();
}
