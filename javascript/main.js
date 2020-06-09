import {map} from "./modules/engine.mjs";
import {colors, init as initUI, draw as drawUI,
  update as updateUI, canvas, cell} from "./modules/ui.mjs";
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
  canvas.top = rect.top;
  canvas.left = rect.left;
}

export function update(nuke = true) { // Update canvas size using grid data
  const canvas = $("#frame");

  if(nuke) {
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

    map.data.actions = Array(x).fill().map(() => Array(y)
      .fill().map(() => Array(0)));
    map.data.states = Array(x).fill().map(() => Array(y).fill(0));
  } else {
    $("#x-size").val(map.size[0]);
    $("#y-size").val(map.size[1]);
  }

  // We want always-square cells, so resize the canvas accordingly
  const ratio = map.size[0] / map.size[1];
  canvas.width = canvas[0].width = Math.round(
    canvas[0].offsetWidth * window.devicePixelRatio);
  canvas.height = canvas[0].height = Math.round(
    canvas[0].offsetWidth * ratio * window.devicePixelRatio);

  cell.size = canvas[0].width / map.size[1];

  cell.focus = undefined;
  cell.hover = undefined;
  cell.target = undefined;

  updateUI();
  drawUI();
}

$(document).ready(init);
