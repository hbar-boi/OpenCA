import * as renderer from "./modules/renderer.mjs";
import {vec2, vec3} from "./modules/vectors.mjs";
import {map, action, start, stop, reset} from "./modules/engine.mjs";
import * as ui from "./modules/ui.mjs";

function init() {
  const canvas = $("#frame");
  // First thing first: bind all events
  canvas.on("mousemove mouseout", function(event) {
    if(!map.canvas.disabled) ui.cellHover(event)
  });

  canvas.click(function(event) {
    if(!map.canvas.disabled) ui.cellClick(event)
  });

  $("#update-grid").click(update);
  $("#grid-display").click(ui.draw);

  $("#state-color").colorpicker({
    useAlpha: false,
    format: "rgb"
  });

  $("#add-state").click(function() {
    ui.saveState(undefined)
  });

  $("#edit-state").click(function(event) {
    ui.saveState($("#state-list").attr("active"))
  });

  $("#remove-state").click(function(event) {
    ui.removeState($("#state-list").attr("active"))
  });

  $("#target-list .dropdown-item").click(function(event) {
    ui.setActionTarget(event);
  });

  $("#engine-start").click(function(event) {
    const target = $("#engine-gen").val();
    const interval = $("#engine-interval").val();
    $("#engine-start").prop("disabled", true);
    start(target > 0 ? target : undefined, interval);
  });

  $("#engine-stop").click(function(event) {
    $("#engine-start").prop("disabled", false);
    stop();
  });

  $("#engine-reset").click(reset);

  $("#action-apply").click(ui.saveAction);

  $("#action-cancel").click(function() {
    map.canvas.disabled = false;
    $("#main-menu").show();
    $("#action-menu").hide();
    map.cell.target = undefined;
    ui.draw();
  });

  $("#action-add").click(function() {
    map.canvas.disabled = true;
    $("#action-menu").show();
    $("#main-menu").hide()
    ui.draw();
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

  // Update our map object: it's kinda important
  map.grid.x = x;
  map.grid.y = y;

  // We want always-square cells, so resize the canvas accordingly
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
  map.cell.target = undefined;

  // Fill data array with blank objects
  map.data = [];
  const init = JSON.stringify({
    "state": 0,
    "actions": []
  }); // Fill all cells
  for(let i = 0; i < x; i++) {
    let col = [];
    for(let j = 0; j < y; j++) {
      col.push(JSON.parse(init)); // Make a shitton of deep copies
    }
    map.data.push(col);
  }
  // Create default state - boring
  map.states = [{
    "name": "Default",
    "color": ui.colors.DEFAULT_COLOR
  }];

  ui.update();
  ui.draw();
}

$(document).ready(init);
