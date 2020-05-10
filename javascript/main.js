import {map} from "./modules/engine.mjs";
import {colors, init as initUI,
  update as updateUI, settings} from "./modules/ui.mjs";
import {vec2} from "./modules/vectors.mjs";

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
  settings.canvas.top = rect.top;
  settings.canvas.left = rect.left;
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
  map.size = new vec2(x, y);

  // We want always-square cells, so resize the canvas accordingly
  const ratio = x / y;
  settings.canvas.width = canvas[0].width = Math.round(
    canvas[0].offsetWidth * window.devicePixelRatio);
  settings.canvas.height = canvas[0].height = Math.round(
    canvas[0].offsetWidth * ratio * window.devicePixelRatio);

  settings.cell.size = canvas[0].width / y;

  settings.cell.focus = undefined;
  settings.cell.hover = undefined;
  settings.cell.target = undefined;

  // Reset data array
  map.data.actions = Array(x).fill().map(() => Array(y)
    .fill().map(() => Array(0)));
  map.data.states = Array(x).fill().map(() => Array(y).fill(0));

  updateUI();
}

$(document).ready(init);
