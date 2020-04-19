import {vec3} from "./vectors.mjs";

// This will render the cells on our canvas

const stroke = 1.0;

export function grid(ctx, map) { // Create grid and display it

  ctx.lineWidth = stroke;
  ctx.strokeStyle = "#A1A1A1";

  // Paramenter size refers to total space available, n to number of spaces
  // and stroke to line thickness.
  let parallels = function(ctx, size, length, stroke, n, dir) {
    n = +n + 1;
    let offset = (size - (n * stroke)) / (n - 1);

    ctx.beginPath();
    for(let i = 0; i < n; i++) {
      ctx.moveTo(
        dir ? 0 : ((offset + stroke) * i) + 0.5,
        dir ? ((offset + stroke) * i) + 0.5 : 0
      );
      ctx.lineTo(
        dir ? length : ((offset + stroke) * i) + 0.5,
        dir ? ((offset + stroke) * i) + 0.5 : length
      );
    }
    ctx.stroke();
  }

  parallels(ctx, map.canvas.width, map.canvas.height, stroke, map.grid.y, false);
  parallels(ctx, map.canvas.height, map.canvas.width, stroke, map.grid.x, true);
}

export function cells(ctx, map) {
  for(let x = 0; x < map.grid.x; x++) {
    for(let y = 0; y < map.grid.y; y++) {
      cell(ctx, x, y, map);
    }
  }
}

const hoverColor = new vec3(195, 235, 239);
const focusColor = new vec3(125, 153, 237); // Temporary color for active cell

export function cell(ctx, x, y, map, color=map.data[x][y].color) { // Inefficient AF
  const box = (map.cell.margin * 2) + map.cell.size;
  ctx.beginPath();
  ctx.rect(
    map.cell.margin + (box * y) + 0.5,
    map.cell.margin + (box * x) + 0.5,
    map.cell.size, map.cell.size);
  ctx.fillStyle = "rgba(" + color.x + ", " + color.y + ", " + color.z + ", 255)";
  ctx.fill();
}

export function draw(ctx, map, g) {
  ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
  if(g) grid(ctx, map);
  cells(ctx, map);

  const focus = map.cell.focus;
  const hover = map.cell.hover;
  if(hover != undefined) cell(ctx, hover.x, hover.y, map, hoverColor);
  if(focus != undefined) cell(ctx, focus.x, focus.y, map, focusColor);
}
