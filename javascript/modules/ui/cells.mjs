import {vec2} from "../vectors.mjs";
import {map} from "../engine.mjs";
import {notifyChange} from "../renderer.mjs";
import {draw, settings} from "../ui.mjs";
import {fillActionList} from "./actions.mjs";

// =============== UI STUFF FOR CELL INTERACTIONS ===================

function getMode() { // This is no good
  return $("#main-menu").is(":visible");
}

function setActive(data) {
  if(getMode()) {
    notifyChange(settings.cell.focus);
    settings.cell.focus = data;
  } else {
    notifyChange(settings.cell.target);
    settings.cell.target = data;
  }
}

function getActive() {
  return getMode() ? settings.cell.focus : settings.cell.target;
}

export function click(e) {
  const cell = eventCell(e);

  if(cell.equals(getActive())) setActive(undefined);
  else setActive(cell);

  update();
}

export function hover(e) { // Cell with cursor on changes color
  const cell = eventCell(e);
  const hover = settings.cell.hover;
  notifyChange(hover);
  switch(e.type) {
    case "mousemove":
      if(!cell.equals(hover)) {
        settings.cell.hover = cell;
        return;
      }
      break;
    case "mouseout":
      settings.cell.hover = undefined; // Reset object
      break;
  }

  draw();
}

function eventCell(e) {
  const rel = new vec2( // Translate to top-left of canvas
    e.pageX - settings.canvas.left,
    e.pageY - settings.canvas.top);

  return new vec2( // Just divide and clamp to get index. Easy as that.
    Math.min(map.size.x - 1, Math.max(
      0, Math.floor(rel.y / settings.cell.size))),
    Math.min(map.size.y - 1, Math.max(
      0, Math.floor(rel.x / settings.cell.size))));
}

export function move(e) {
  let active = getActive();
  if(active == undefined) return;

  active = new vec2(active);
  const up = new vec2(1, 0);
  const right = new vec2(0, 1);

  switch(e.which) {
    case 37:
      if(active.y != 0) active.sub(right);
      break;
    case 38:
      if(active.x != 0) active.sub(up);
      break;
    case 39:
      if(active.y != map.size.y - 1) active.add(right);
      break;
    case 40:
      if(active.x != map.size.x - 1) active.add(up);
      break;
  }

  if(!active.equals(getActive())) {
    e.preventDefault();
    setActive(active);
    update();
  }
}

export function update(doDraw = true) {
  const mode = getMode();
  const active = getActive();

  if(active == undefined) {
    if(mode) { // If we are in focus mode do UI stuff for focus mode
      $("#cell-actions").html("");
      $("#current-cell").html("Select cell");
      $("#cell-menu").hide();
    } else $("#target-cell").html("Select target");
  } else {
    if(mode) { // Update cell actions 'n shit
      $("#current-cell").html(
        "Active cell: (" + active.x + ", " + active.y + ")");
      $("#cell-menu").show();

      fillActionList();
    } else $("#target-cell").html(
      "Target is (" + active.x + ", " + active.y + ")");
  }

  if(doDraw) draw();
}
