import {vec3} from "./vectors.mjs";
import {draw as render} from "./renderer.mjs";
import {map} from "./engine.mjs";

import * as engineUI from "./ui/engine.mjs";
import * as cellsUI from "./ui/cells.mjs";
import * as actionsUI from "./ui/actions.mjs";
import * as statesUI from "./ui/states.mjs";

// Handle all UI stuff

// Define all colors we'll be using
// FEAR NOT: even if one of these colors is chosen to represent a state, nothing
// bad happens. The only thing is that it will be impossible to tell them apart.
export const colors = {
  "HOVER_COLOR": new vec3(195, 235, 239),
  "FOCUS_COLOR": new vec3(125, 153, 237),
  "TARGET_COLOR": new vec3(152, 111, 255),
  "DEFAULT_COLOR": new vec3(255, 255, 255),
  "LINE_COLOR": new vec3(161, 161, 161)
};

export function init() {
  // First thing first: bind all events
  $("#frame").on("mousemove mouseout", (e) => {
    if(!map.canvas.disabled) cellsUI.cellHover(e)
  });

  $("#frame").click((e) => {
    if(!map.canvas.disabled) cellsUI.cellClick(e)
  });

  $("#grid-display").click(() => draw());

  // This is needed to make Bootstrap dropdowns work as selects
  $(".normal-list").on("click", ".dropdown-item", (e) => {
    const active = +e.target.getAttribute("data");
    e.target.parentElement.setAttribute("active", active);
  });

  // State
  $("#state-add").click(() => statesUI.saveState(undefined));

  $("#state-edit").click(
    () => statesUI.saveState($("#state-list").attr("active")));

  $("#state-remove").click(
    (e) => statesUI.removeState($("#state-list").attr("active")));

  $("#state-set").on("click", ".set-state-entry", (e) => {
      const cell = map.cell.focus;
      map.data.states[cell.x][cell.y] = e.target.getAttribute("data");
  });

  $("#state-list").on("click", ".state-edit-entry",
    (e) => statesUI.editState(e));

  // Create default state
  map.states = [{
    "name": "Default",
    "color": colors.DEFAULT_COLOR
  }];

  // Engine
  $("#engine-start").click(() => engineUI.startEngine());
  $("#engine-stop").click(() => engineUI.stopEngine());
  $("#engine-reset").click(() => engineUI.resetEngine());

  // Action
  $("#action-apply").click(() => actionsUI.saveAction());
  $("#action-cancel").click(() => actionsUI.cancelAction());
  $("#action-add").click(() => actionsUI.addAction());

  $("#cell-actions").on("click", ".action-delete",
    (e) => actionsUI.removeAction(e));
  $("#cell-actions").on("click", ".action-share",
    (e) => actionsUI.shareAction(e));

  $("#target-list .dropdown-item").click(
    (e) => actionsUI.setActionTarget(e));

  // Keyboard
  $(document).keydown((event) => cellsUI.moveActive(event));
}

export function getColorBox(color, inline = false) {
  const box = $("<span></span>").addClass("color-box")
    .css("background-color", new vec3(color).toRGBA());
  if(inline) return box.addClass("color-box-inline")[0].outerHTML;
  return box;
}

export function update() {
  cellsUI.update();
  statesUI.update();
}

export function draw() { // Gets context and calls renderer's draw()
  const grid = $("#grid-display").prop("checked");
  const ctx = $("#frame")[0].getContext("2d");

  render(ctx, map, grid);
}
