import {vec2} from "../vectors.mjs";
import {map} from "../engine.mjs";
import {notifyIfValid} from "../renderer.mjs";
import {draw, cell, canvas} from "../ui.mjs";
import {fillActionList} from "./actions.mjs";

// =============== UI STUFF FOR CELL INTERACTIONS ===================

export function setUICell(selector, value) {
  notifyIfValid(cell[selector]);
  cell[selector] = value;
}

export function click(e) {
  const current = eventCell(e);
  const active = cell[cell.ACTIVE];
  
  if(current.equals(active)) setUICell(cell.ACTIVE, undefined);
  else setUICell(cell.ACTIVE, current);

  update();
  draw();
}

export function hover(e) { // Cell with cursor on changes color
  const current = eventCell(e);

  switch(e.type) {
    case "mousemove":
      if(!current.equals(hover)) setUICell(cell.HOVER, current);
      break;
    case "mouseout":
      setUICell(cell.HOVER, undefined); // Reset object
      break;
  }

  draw();
}

function eventCell(e) {
  const rel = new vec2( // Translate to top-left of canvas
    e.pageX - canvas.left,
    e.pageY - canvas.top);

  return new vec2( // Just divide and clamp to get index. Easy as that.
    Math.min(map.size.x - 1, Math.max(
      0, Math.floor(rel.y / cell.size))),
    Math.min(map.size.y - 1, Math.max(
      0, Math.floor(rel.x / cell.size))));
}

export function move(e) {
  const active = cell[cell.ACTIVE];
  if(!active) return;

  const current = new vec2(active);
  const up = new vec2(1, 0);
  const right = new vec2(0, 1);

  switch(e.which) {
    case 37:
      if(active.y != 0) current.sub(right);
      break;
    case 38:
      if(active.x != 0) current.sub(up);
      break;
    case 39:
      if(active.y != map.size.y - 1) current.add(right);
      break;
    case 40:
      if(active.x != map.size.x - 1) current.add(up);
      break;
  }

  if(!current.equals(active)) {
    e.preventDefault();
    setUICell(cell.ACTIVE, current);

    update();
    draw();
  }
}

export function update() {
  const active = cell[cell.ACTIVE];
  const mode = (active == cell.focus);
  if(!active) {
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
}
