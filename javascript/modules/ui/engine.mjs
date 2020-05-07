import {start as engineStart, stop as engineStop,
  reset as engineReset, map} from "../engine.mjs";
import {draw} from "../ui.mjs";
import {update} from "./cells.mjs";

// ================= UI STUFF FOR ENGINE OPERATION =======================

export function reset() {
  $("#engine-reset").prop("disabled", true);
  map.canvas.disabled = false;
  engineReset();
  draw();
}

export function stop() {
  $("#engine-start, #engine-reset").prop("disabled", false);
  $("#engine-stop").prop("disabled", true);
  map.canvas.disabled = false;
  engineStop();
  draw();
}

export function start() {
  const target = $("#engine-gen").val();
  const interval = $("#engine-interval").val();
  $("#engine-start, #engine-reset").prop("disabled", true);
  $("#engine-stop").prop("disabled", false);

  map.canvas.disabled = true;
  map.cell.focus = undefined;
  update();

  engineStart(target > 0 ? target : undefined, interval);
}
