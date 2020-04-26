import {vec3} from "./vectors.mjs";
import {colors} from "./ui.mjs";

// Canvas renderer module, does all the interfacing with ctx

// Draw (num) of parallel equidistant lines along some (space),
// that are (length) long following a specific (dir)
function parallels(ctx, space, length, num, dir) {
  num = +num + 1;
  const stroke = ctx.lineWidth;
  const offset = (space - (num * stroke)) / (num - 1);
  ctx.beginPath();
  for(let i = 0; i < num; i++) {
    // Looks awful but that's how it is, canvas' pixels start in the middle. Why?
    // Dunno. To make them not look like shit we just sum by 0.5 and that's it
    const start = Math.ceil(
      (offset + stroke) * i + ((i + 1) == num ? 0.5 : 0)
    );
    ctx.moveTo(
      dir ? 0 : start,
      dir ? start : 0
    );
    ctx.lineTo(
      dir ? length : start,
      dir ? start : length
    );
  }
  ctx.stroke(); // Self explanatory
}

// Draw a single cell, if no color is specified use the cell's
function cell(ctx, x, y, map, color=map.states[map.data[x][y].state].color) {
  const box = (map.cell.margin * 2) + map.cell.size;
  ctx.beginPath();
  ctx.rect(
    map.cell.margin + (box * y),
    map.cell.margin + (box * x),
    map.cell.size, map.cell.size);
  ctx.fillStyle = new vec3(color).toRGBA();
  ctx.fill();
}

// Draw EVERYTHING: grid, cells, you name it.
export function draw(ctx, map, grid) {
  ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
  // If canvas is disabled make it look pale
  if(map.canvas.disabled) ctx.globalAlpha = 0.5;
  else ctx.globalAlpha = 1.0;

  if(grid) { // Draw the grid first (if you want it)
    ctx.lineWidth = 1.0; // Grid stroke
    ctx.strokeStyle = new vec3(colors.LINE_COLOR).toRGBA();

    parallels(ctx, map.canvas.width, map.canvas.height, map.grid.y, false);
    parallels(ctx, map.canvas.height, map.canvas.width, map.grid.x, true);
  }

  // Then iterate and draw every cell
  for(let x = 0; x < map.grid.x; x++) {
    for(let y = 0; y < map.grid.y; y++) {
      cell(ctx, x, y, map);
    }
  }

  // Finally overdraw with special ones. Not too inefficient hopefully.
  const focus = map.cell.focus;
  const hover = map.cell.hover;
  const target = map.cell.target;

  if(hover != undefined) cell(ctx, hover.x, hover.y, map, colors.HOVER_COLOR);
  if(focus != undefined) cell(ctx, focus.x, focus.y, map, colors.FOCUS_COLOR);
  if(target != undefined) cell(ctx, target.x, target.y, map, colors.TARGET_COLOR);
}
