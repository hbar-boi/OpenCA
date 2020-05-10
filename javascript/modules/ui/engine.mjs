import {start as engineStart, stop as engineStop,
  reset as engineReset} from "../engine.mjs";
import {draw, settings} from "../ui.mjs";
import {update} from "./cells.mjs";

// ================= UI STUFF FOR ENGINE OPERATION =======================

export function reset() {
  $("#engine-reset").prop("disabled", true);
  settings.canvas.disabled = false;
  engineReset();
  draw();
}

export function stop() {
  $("#engine-start, #engine-reset").prop("disabled", false);
  $("#engine-stop").prop("disabled", true);
  settings.canvas.disabled = false;
  engineStop();
  draw();
}

export function start() {
  const target = $("#engine-gen").val();
  const interval = $("#engine-interval").val();
  $("#engine-start, #engine-reset").prop("disabled", true);
  $("#engine-stop").prop("disabled", false);

  settings.canvas.disabled = true;
  settings.cell.focus = undefined;
  update();

  engineStart(target > 0 ? target : undefined, interval);
}
