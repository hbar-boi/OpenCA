import * as renderer from "./modules/renderer.mjs";
import {vec2, vec3} from "./modules/vectors.mjs";
import * as engine from "./modules/engine.mjs";

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
  states: [],
  data: []
}

const canvas = $("#frame");
const ctx = canvas[0].getContext("2d");

const displayGrid = $("#grid-display");

function main() {
  canvas.on("mousemove mouseout", function(event) {
    cellHover(event)
  });

  canvas.click(function(event) {
    cellClick(event)
  });

  $("#update-grid").click(update);
  $("#grid-display").click(update);

  $("#submit-state").click(state);

  update();
}

function update() { // Update canvas size using grid data
  let x = $("#x-size").val();
  let y = $("#y-size").val();

  if(x < 1) {
    $("#x-size").val(1);
    update();
    return;
  } if(y < 1) {
    $("#y-size").val(1);
    update();
    return;
  }

  if(x > y) [x, y] = [y, x]

  map.grid.x = x;
  map.grid.y = y;

  const ratio = x / y;
  map.canvas.width = canvas[0].width = Math.round(
    canvas[0].offsetWidth * window.devicePixelRatio);
  map.canvas.height = canvas[0].height = Math.round(
    canvas[0].offsetWidth * ratio * window.devicePixelRatio);

  const rect = canvas[0].getBoundingClientRect();
  map.canvas.top = rect.top;
  map.canvas.left = rect.left;

  // Cells gunna take 95% of canvas
  map.cell.size = (canvas[0].width * 0.95) / y;
  // The remaining 5% are margins and grid lines
  map.cell.margin = (canvas[0].width * 0.05) / (2 * y);

  map.cell.hover = undefined;
  map.cell.focus = undefined;

  map.data = [];
  const init = JSON.stringify({
    color: new vec3(255, 255, 255),
  }); // Fill all cells white
  for(let i = 0; i < x; i++) {
    let col = [];
    for(let j = 0; j < y; j++) {
      col.push(JSON.parse(init));
    }
    map.data.push(col);
  }
  renderer.draw(ctx, map, displayGrid.prop("checked"));
}

function state() {
  const submit = $("#submit-state");
  if(submit.prop("edit")) {

  } else {
    const state = {
      name: $("#state-name").val(),
      color: "rgba(" +
        $("#state-color-r").val() + ", " +
        $("#state-color-g").val() + ", " +
        $("#state-color-b").val() + ", 255)"
      };
    map.states.push(state);
  }
}

function cellClick(event) {
  const cell = target(event);
  const focus = map.cell.focus;

  if(!cell.equals(focus)) map.cell.focus = cell;
  else map.cell.focus = undefined;

  const msg = $("#current-cell");

  if(map.cell.focus == undefined) msg.html("Select cell");
  else msg.html("Current cell: " + cell.x + " - " + cell.y);

  renderer.draw(ctx, map, displayGrid.prop("checked"));
}

function cellHover(event) {
  const cell = target(event);
  const hover = map.cell.hover;
  switch(event.type) {
    case "mousemove":
      if(!cell.equals(hover)) {
        map.cell.hover = cell;
        return;
      }
      break;
    case "mouseout":
      map.cell.hover = undefined;
      break;
  }
  renderer.draw(ctx, map, displayGrid.prop("checked"));
}

function target(event) {
  const rel = new vec2(
    event.pageX - map.canvas.left,
    event.pageY - map.canvas.top
  );
  const box = map.cell.size + (map.cell.margin * 2);
  return new vec2(
    Math.min(map.grid.x - 1, Math.max(0, Math.floor(rel.y / box))),
    Math.min(map.grid.y - 1, Math.max(0, Math.floor(rel.x / box)))
  );
}

$(document).ready(main);
