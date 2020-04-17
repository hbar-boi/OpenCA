import * as renderer from "./modules/renderer.mjs";

const map = {
  grid: {
    x: 0,
    y: 0,
  },
  canvas: {
    x: 0,
    y: 0
  },
  cell: {
    size: 0,
    margin: {
      x: 0,
      y: 0
    }
  }
}

function main() {
  const canvas = document.getElementById("frame");
  canvas.addEventListener("click", editCell);

  document.getElementById("update-grid").addEventListener("click", update);

  update();
  canvas.style.visibility = "visible";
}

function update() { // Update canvas size using grid data
  const canvas = document.getElementById("frame");
  let x = document.getElementById("x-size").value;
  let y = document.getElementById("y-size").value;

  if(x > y) {
    [x, y] = [y, x]
  }

  map.grid.x = x;
  map.grid.y = y;

  const ratio = x / y;
  map.canvas.x = canvas.width = canvas.offsetWidth;
  map.canvas.y = canvas.height = canvas.offsetWidth * ratio;

  map.cell.size = (canvas.width * 0.9) / y;
  map.cell.margin = (canvas.width * 0.1) / (2 * y);

  const ctx = canvas.getContext("2d");

  const displayGrid = document.getElementById("grid-display");
  if(displayGrid.checked) {
    renderer.grid(ctx, map);
  }

  renderer.cells(ctx, map);
}

function editCell(e) {
  if(e.region) {
    alert("Clicked on " + region);
  }
}

window.onload = main;
