import {vec3} from "./vectors.mjs";
import {colors, settings} from "./ui.mjs";
import {map} from "./engine.mjs";

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
function cell(ctx, x, y, map, color = undefined) {
  if(color == undefined) color = map.states[map.data.states[x][y]].color;
  const box = (settings.cell.margin * 2) + settings.cell.size;
  ctx.beginPath();
  ctx.rect(
    settings.cell.margin + (box * y),
    settings.cell.margin + (box * x),
    settings.cell.size, settings.cell.size);
  ctx.fillStyle = new vec3(color).toRGBA();
  ctx.fill();
}

// Draw EVERYTHING: grid, cells, you name it.
export function draw(ctx, grid) {
  ctx.clearRect(0, 0, settings.canvas.width, settings.canvas.height);
  // If canvas is disabled make it look pale
  if(settings.canvas.disabled) ctx.globalAlpha = 0.5;
  else ctx.globalAlpha = 1.0;

  if(grid) { // Draw the grid first (if you want it)
    ctx.lineWidth = 1.0; // Grid stroke
    ctx.strokeStyle = new vec3(colors.LINE_COLOR).toRGBA();

    parallels(ctx, settings.canvas.width, settings.canvas.height, map.size.y, false);
    parallels(ctx, settings.canvas.height, settings.canvas.width, map.size.x, true);
  }

  // Then iterate and draw every cell
  for(let x = 0; x < map.size.x; x++) {
    for(let y = 0; y < map.size.y; y++) {
      cell(ctx, x, y, map);
    }
  }

  // Finally overdraw with special ones. Hopefully not too inefficient.
  const focus = settings.cell.focus;
  const hover = settings.cell.hover;
  const target = settings.cell.target;

  if(hover != undefined) cell(ctx, hover.x, hover.y, map, colors.HOVER_COLOR);
  if(focus != undefined) cell(ctx, focus.x, focus.y, map, colors.FOCUS_COLOR);
  if(target != undefined) cell(ctx, target.x, target.y, map, colors.TARGET_COLOR);
}
