import * as renderer from "./modules/renderer.mjs";
import {vec2, vec3} from "./modules/vectors.mjs";

const map = {
  grid: {
    x: 0,
    y: 0,
  },
  canvas: {
    top: 0,
    left: 0,
    width: 0,
    height: 0
  },
  cell: {
    size: 0,
    margin: 0,
    hover: undefined,
    focus: undefined
  },
  data: []
}

const canvas = document.getElementById("frame");
const ctx = canvas.getContext("2d");

const displayGrid = document.getElementById("grid-display");

function main() {
  ["click", "mousemove", "mouseout"].forEach(function(type) {
    canvas.addEventListener(type, function(event) {
      edit(event)
    })
  });

  document.getElementById("update-grid").addEventListener("click", update);
  document.getElementById("grid-display").addEventListener("click", update);

  update();

  canvas.style.visibility = "visible";
}

function update() { // Update canvas size using grid data
  let x = document.getElementById("x-size").value;
  let y = document.getElementById("y-size").value;

  if(x > y) [x, y] = [y, x]

  map.grid.x = x;
  map.grid.y = y;

  const ratio = x / y;
  map.canvas.width = canvas.width = canvas.offsetWidth;
  map.canvas.height = canvas.height = canvas.offsetWidth * ratio;

  const rect = canvas.getBoundingClientRect();
  map.canvas.top = rect.top;
  map.canvas.left = rect.left;

  // Cells gunna take 95% of canvas
  map.cell.size = (canvas.width * 0.95) / y;
  // The remaining 5% are margins and grid lines
  map.cell.margin = (canvas.width * 0.05) / (2 * y);

  map.data = [];
  const init = JSON.stringify({
    color: new vec3(255, 255, 255),
    status: 0
  }); // Fill all cells white
  for(let i = 0; i < x; i++) {
    let col = [];
    for(let j = 0; j < y; j++) {
      col.push(JSON.parse(init));
    }
    map.data.push(col);
  }

  renderer.draw(ctx, map, displayGrid.checked);
}

function edit(event) {
  const rel = new vec2(
    event.pageX - map.canvas.left,
    event.pageY - map.canvas.top
  );
  const box = map.cell.size + (map.cell.margin * 2);
  const cell = new vec2(
    Math.min(map.grid.x - 1, Math.max(0, Math.floor(rel.y / box))),
    Math.min(map.grid.y - 1, Math.max(0, Math.floor(rel.x / box)))
  );
  const hover = map.cell.hover;
  const focus = map.cell.focus;
  const status = map.data[cell.x][cell.y].status;

  switch(event.type) {
    case "click":
      if(!cell.equals(focus)) {
        try {
          map.data[focus.x][focus.y].status = 0;
        } catch { };
        map.data[cell.x][cell.y].status = 2;
        map.cell.focus = cell;
      } else {
        try {
          map.data[focus.x][focus.y].status = 0;
        } catch { };
        map.cell.focus = undefined;
      }
      renderer.draw(ctx, map, displayGrid.checked);
      break;
    case "mousemove":
      if(!cell.equals(hover)) {
        if(hover != undefined && !hover.equals(focus)) {
          try {
            map.data[hover.x][hover.y].status = 0;
          } catch { };
        }
        map.data[cell.x][cell.y].status = 1;
        map.cell.hover = cell;
        renderer.draw(ctx, map, displayGrid.checked);
      }
      break;
    case "mouseout":
      if(status == 1) map.data[cell.x][cell.y].status = 0;
      map.cell.hover = undefined;
      renderer.draw(ctx, map, displayGrid.checked);
      break;
  }
}

window.onload = main;
