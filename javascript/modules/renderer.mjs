import {vec3} from "./vectors.mjs";

// Canvas renderer module, does all the interfacing with ctx

function parallels(ctx, space, length, num, dir) {
  num = +num + 1;
  const stroke = ctx.lineWidth;
  const offset = (space - (num * stroke)) / (num - 1);
  ctx.beginPath();
  for(let i = 0; i < num; i++) {
    const start = Math.ceil( // Looks awful but that's how it is
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
  ctx.stroke();
}

function cell(ctx, x, y, map, color=map.states[map.data[x][y].state].color) {
  const box = (map.cell.margin * 2) + map.cell.size;
  ctx.beginPath();
  ctx.rect(
    map.cell.margin + (box * y),
    map.cell.margin + (box * x),
    map.cell.size, map.cell.size);
  ctx.fillStyle = "rgba(" + color.x + ", " + color.y + ", " + color.z + ", 255)";
  ctx.fill();
}

export function draw(ctx, map, grid) {
  ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);

  if(grid) {
    const lineColor = new vec3(161, 161, 161);
    ctx.lineWidth = 1.0; // Grid stroke
    ctx.strokeStyle = lineColor.toRGBA();

    parallels(ctx, map.canvas.width, map.canvas.height, map.grid.y, false);
    parallels(ctx, map.canvas.height, map.canvas.width, map.grid.x, true);
  }

  for(let x = 0; x < map.grid.x; x++) {
    for(let y = 0; y < map.grid.y; y++) {
      cell(ctx, x, y, map);
    }
  }

  const focus = map.cell.focus;
  const hover = map.cell.hover;

  const hoverColor = new vec3(195, 235, 239); // Temporary color for mouseover cell
  const focusColor = new vec3(125, 153, 237); // Temporary color for clicked cell

  if(hover != undefined) cell(ctx, hover.x, hover.y, map, hoverColor);
  if(focus != undefined) cell(ctx, focus.x, focus.y, map, focusColor);
}
