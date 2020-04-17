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

  parallels(ctx, map.canvas.x, map.canvas.y, stroke, map.grid.y, false);
  parallels(ctx, map.canvas.y, map.canvas.x, stroke, map.grid.x, true);
}

export function cells(ctx, map) {

  let offset = (map.cell.margin * 2) + map.cell.size;

  for(let x = 0; x < map.grid.x; x++) {
    for(let y = 0; y < map.grid.y; y++) {
      ctx.rect(
        map.cell.margin + (offset * y) + 0.5,
        map.cell.margin + (offset * x) + 0.5,
        map.cell.size, map.cell.size);
      ctx.stroke();
    }
  }
}
