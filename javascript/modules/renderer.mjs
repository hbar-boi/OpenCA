import {vec2, vec3} from "./vectors.mjs";
import {colors, settings} from "./ui.mjs";
import {map} from "./engine.mjs";

let updated = [];

// Canvas renderer module, does all the interfacing with ctx

// Draw a single cell, if no color is specified use the cell's
function cell(ctx, cell, color = undefined) {
  const state = map.data.states[cell.x][cell.y];
  if(color == undefined) color = map.states[state].color;

  const size = settings.cell.size;
  ctx.beginPath();
  ctx.rect(Math.floor(size * cell.y), Math.floor(size * cell.x),
    Math.ceil(size), Math.ceil(size));
  ctx.fillStyle = new vec3(color).toRGBA();
  ctx.fill();
}

// Draw EVERYTHING
export function draw(ctx) {
  // Iterate and draw cells
  updated.forEach((item) => cell(ctx, item));
  updated = [];

  // Then overdraw with special ones. Hopefully not too inefficient.
  const focus = settings.cell.focus;
  const hover = settings.cell.hover;
  const target = settings.cell.target;

  if(hover != undefined) cell(ctx, hover, colors.HOVER_COLOR);
  if(focus != undefined) cell(ctx, focus, colors.FOCUS_COLOR);
  if(target != undefined) cell(ctx, target, colors.TARGET_COLOR);
}

export function notifyChange(cell) {
  if(cell == undefined) return;
  if(Array.isArray(cell)) updated.push(...cell);
  else updated.push(cell);
}

export function notifyAll() {
  updated = Array(map.size.x).fill().map(
    (row, i) => Array(map.size.y).fill().map(
      (cell, j) => new vec2(i, j))).flat();
}
