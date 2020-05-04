import {map} from "./modules/engine.mjs";
import {colors, init as initUI,
  update as updateUI} from "./modules/ui.mjs";
import {cellClick} from "./modules/ui/cells.mjs";

function init() {
  $("#state-color").colorpicker({
    useAlpha: false,
    format: "rgb"
  });

  $("#update-grid").click(() => update());
  $(window).resize(() => resize());

  initUI();

  resize();
  update();
}

function resize() {
  const rect = $("#frame")[0].getBoundingClientRect();
  map.canvas.top = rect.top;
  map.canvas.left = rect.left;
}

function update() { // Update canvas size using grid data
  const canvas = $("#frame");

  let x = +$("#x-size").val();
  let y = +$("#y-size").val();

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

  // Cells gunna take 95% of canvas
  map.cell.size = (canvas[0].width * 0.95) / y;
  // The remaining 5% are margins and grid lines
  map.cell.margin = (canvas[0].width * 0.05) / (2 * y);

  map.cell.focus = undefined;
  map.cell.hover = undefined;
  map.cell.target = undefined;

  // Reset data array
  map.data.actions = Array(x).fill().map(() => Array(y)
    .fill().map(() => Array(0)));
  map.data.states = Array(x).fill().map(() => Array(y).fill(0));

  updateUI();
}

$(document).ready(init);
