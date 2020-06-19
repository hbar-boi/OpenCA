import {colors, cell} from "./ui.mjs";
import {map} from "./engine.mjs";

let updated = [];

// ================= DISCLAIMER =====================
// This guy gotta run FAST, headaches due to unreadable
// code might be experienced here.

// Canvas renderer module, does all the interfacing with ctx

// Draw a single cell, if no color is specified use the cell's
function drawCell(ctx, current, color = undefined) { // Can this go faster?
  if(!color) color = map.states[ // Sorry, GC thanks you
    map.data.states[current[0]][current[1]]].color;

  const intSize = Math.ceil(cell.size);

  ctx.beginPath();
  ctx.rect(
    Math.floor(cell.size * current[1]),
    Math.floor(cell.size * current[0]),
    intSize, intSize);
  ctx.fillStyle = color.toRGBA();
  ctx.fill();
}

// Draw EVERYTHING
export function draw(ctx) {
  // Iterate and draw cells
  for(let k = 0; k < updated.length; k++)
    drawCell(ctx, updated[k])

  updated = [];
  // Then overdraw with special ones. Hopefully not too inefficient.
  if(cell.focus) drawCell(ctx, cell.focus, colors.FOCUS_COLOR);
  if(cell.hover) drawCell(ctx, cell.hover, colors.HOVER_COLOR);
  if(cell.target) drawCell(ctx, cell.target, colors.TARGET_COLOR);
}

export function notifyIfValid(current) {
  if(current) notify(current[0], current[1]);
}

export function notifyState(id) {
  for(let i = 0; i < map.size[0]; i++)
    for(let j = 0; j < map.size[1]; j++)
      if(map.data.states[i][j] == id)
        notify(i, j)
}

export function notifyAll() {
  for(let i = 0; i < map.size[0]; i++)
    for(let j = 0; j < map.size[1]; j++)
      notify(i, j);
}

export function notify(x, y) {
  updated.push([x, y]);
}

export function cancelNotify() {
  updated = [];
}
