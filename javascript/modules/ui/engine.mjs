import {start as engineStart, stop as engineStop,
  reset as engineReset} from "../engine.mjs";
import {draw, setCanvasState, canvas, cell} from "../ui.mjs";
import {update, setUICell} from "./cells.mjs";

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
  setUICell(cell.FOCUS, undefined);

  update();
  draw();

  engineStart(target > 0 ? target : undefined, interval);
}

export function setStatus(content, generation = undefined) {
  const container = $("#engine-status").html(content);
  if(generation != undefined) container.append("Generation: " + generation);
}
