import {start as engineStart, stop as engineStop,
  reset as engineReset} from "../engine.mjs";
import {draw, settings, setCanvasState, canvas} from "../ui.mjs";
import {update} from "./cells.mjs";
import {notifyChange} from "../renderer.mjs";

// ================= UI STUFF FOR ENGINE OPERATION =======================

export function reset() {
  $("#engine-reset").prop("disabled", true);
  setCanvasState(canvas.ENABLED);
  engineReset();
  draw();
}

export function stop() {
  $("#engine-start, #engine-reset").prop("disabled", false);
  $("#engine-stop").prop("disabled", true);
  setCanvasState(canvas.ENABLED);
  engineStop();
  draw();
}

export function start() {
  const target = $("#engine-gen").val();
  const interval = $("#engine-interval").val();
  $("#engine-start, #engine-reset").prop("disabled", true);
  $("#engine-stop").prop("disabled", false);

  setCanvasState(canvas.DISABLED);
  notifyChange(settings.cell.focus);
  settings.cell.focus = undefined;
  update();

  engineStart(target > 0 ? target : undefined, interval);
}
