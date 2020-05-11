import {vec2, vec3} from "./vectors.mjs";
import {draw as render, notifyAll} from "./renderer.mjs";
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
  "LINE_COLOR": new vec3(230, 230, 230)
};

export const canvas = {
  "ctx": undefined,

  "top": 0,
  "left": 0,
  "width": 0,
  "height": 0,
  "disabled": false,

  "DISABLED": true,
  "ENABLED": false
}

export const cell = {
  "size": 0,

  "focus": undefined,
  "target": undefined,
  "hover": undefined,

  "FOCUS": "focus",
  "TARGET": "target",
  "HOVER": "hover",

  "ACTIVE": "focus"
}

export function init() {
  canvas.ctx = $("#frame")[0].getContext("2d");
  // First thing first: bind all events
  $("#frame").on("mousemove mouseout", (e) => {
    if(!canvas.disabled) cellsUI.hover(e)
  });

  $("#frame").click((e) => {
    if(!canvas.disabled) cellsUI.click(e)
  });

  // This is needed to make Bootstrap dropdowns work as selects
  $(".normal-list").on("click", ".dropdown-item", (e) => {
    if(e.target.classList.contains("color-box")) return;
    const active = +e.target.getAttribute("data");
    e.target.parentElement.setAttribute("active", active);
  });

  // State
  $("#state-add").click(
    () => statesUI.save(undefined));
  $("#state-edit").click(
    () => statesUI.save($("#state-list").attr("active")));
  $("#state-remove").click(
    () => statesUI.remove($("#state-list").attr("active")));
  $("#state-set").on("click", ".set-state-entry", (e) => statesUI.set(e));
  $("#state-list").on("click", ".state-edit-entry", (e) => statesUI.edit(e));

  // Engine
  $("#engine-start").click(() => engineUI.start());
  $("#engine-stop").click(() => engineUI.stop());
  $("#engine-reset").click(() => engineUI.reset());

  // Action
  $("#action-apply").click(() => actionsUI.save());
  $("#action-cancel").click(() => actionsUI.cancel());
  $("#action-add").click(() => actionsUI.add());

  $("#cell-actions").on("click", ".action-delete", (e) => actionsUI.remove(e));
  $("#cell-actions").on("click", ".action-share", (e) => actionsUI.share(e));
  $("#target-list .dropdown-item").click((e) => actionsUI.setActionTarget(e));

  // Keyboard
  $(document).keydown((e) => cellsUI.move(e));

  // Create default state
  map.states = [{
    "name": "Default",
    "color": colors.DEFAULT_COLOR
  }];
}

export function setCanvasState(state) {
  canvas.disabled = state;
  if(state) $("#frame").addClass("disabled");
  else $("#frame").removeClass("disabled");
}

export function update() {
  notifyAll();

  cellsUI.update();
  statesUI.update();
}

export function draw() { // Gets context and calls renderer's draw()
  render(canvas.ctx);
}
