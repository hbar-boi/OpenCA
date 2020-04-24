import * as renderer from "./modules/renderer.mjs";
import {vec2, vec3} from "./modules/vectors.mjs";
import {map} from "./modules/engine.mjs";
import * as ui from "./modules/ui.mjs";

function init() {
  const canvas = $("#frame");
  // First thing first: bind all events
  canvas.on("mousemove mouseout", function(event) {
    ui.cellHover(event)
  });

  canvas.click(function(event) {
    ui.cellClick(event)
  });

  $("#update-grid").click(update);
  $("#grid-display").click(ui.draw);

  $("#state-color").colorpicker({
    useAlpha: false,
    format: "rgb"
  });

  $("#add-state").click(function() {
    ui.saveState()
  });

  $("#edit-state").click(function(event) {
    ui.saveState($("#state-list").attr("state-id"))
  });

  $("#remove-state").click(function(event) {
    ui.removeState($("#state-list").attr("state-id"))
  });

  update();
}

function update() { // Update canvas size using grid data
  const canvas = $("#frame");

  let x = $("#x-size").val();
  let y = $("#y-size").val();

  if(x < 1) { // Check if size data is valid
    $("#x-size").val(1);
    update();
    return;
  } if(y < 1) {
    $("#y-size").val(1);
    update();
    return;
  }

  if(x > y) [x, y] = [y, x] // There should be always more cols than rows

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

  // Fill data array with blank objects
  map.data = [];
  const init = JSON.stringify({
    "state": 0,
    "actions": [{
      "target": "1 - 2",
      "condition": 0,
      "result": 1
    }]
  }); // Fill all cells
  for(let i = 0; i < x; i++) {
    let col = [];
    for(let j = 0; j < y; j++) {
      col.push(JSON.parse(init)); // Make a shitton of deep copies
    }
    map.data.push(col);
  }

  map.states.push({
    "name": "Default",
    "color": new vec3(255, 255, 255)
  });

  ui.update();
  ui.draw();
}

$(document).ready(init);
