import {vec2, vec3} from "../vectors.mjs";
import {map} from "../engine.mjs";
import {notifyState, notify} from "../renderer.mjs";
import {colors, draw, cell} from "../ui.mjs";

// ================= UI STUFF FOR WORKING ON STATES =====================

export function save(id = undefined) { // Create new state or save edits
  const name = $("#state-name").val();
  const color = $("#state-color").colorpicker("getValue").match(/\d+/g);
  const state = {
    "name": name,
    "color": new vec3(color[0], color[1], color[2])
  };

  // State should have an unique name and color
  if(name == "" || map.states.some(
    (item, i) => (item.color.equals(state.color) && i != id))) return;

  // Create new state or update old one
  if(!id) {
    map.states.push(state);
    id = map.states.length - 1;
  } else map.states[id] = state;

  notifyState(id);
  // Rebuild list
  update();
  draw();
}

export function remove(id) { // Rip
  // Cells with this id have to be reset...
  notifyState(id);

  map.states.splice(id, 1);
  if(map.states.length == 0) {
    map.states.push({
      "name": "Default",
      "color": colors.DEFAULT_COLOR
    });
  }
  // Rebuild list
  update();
  draw();
}

export function edit(e) { // Change UI to allow editing of state params
  const id = e.target.getAttribute("data");
  const state = map.states[id];
  // Prepare current state data
  $("#state-list").attr("active", id);
  $("#state-name").val(state.name);
  $("#state-color").colorpicker("setValue", state.color.toRGBA());

  $("#state-edit, #state-remove").show();
  $("#state-add").hide();
}

export function set(e) {
  const state = e.target.getAttribute("data");
  map.data.states[cell.focus[0]][cell.focus[1]] = state;
  notify(cell.focus[0], cell.focus[1]);
}

export function getColorBox(color, inline = false) {
  const box = $("<span></span>").addClass("color-box")
    .css("background-color", color.toRGBA());
  if(inline) return box.addClass("color-box-inline")[0].outerHTML;
  return box;
}

export function fillStateList(list, identifier) { // Fills a bootstrap dropdown
  list.html("");

  const entry = $("<button></button>");
  entry.addClass("dropdown-item d-flex justify-content-between " + identifier);

  map.states.forEach(function(item, i) {
    entry.attr("data", i);
    entry.html(item.name);
    entry.append(getColorBox(item.color));
    list.append(entry[0].cloneNode(true));
  });
}

export function update() {
  $("#state-name").val("");
  $("#state-color").colorpicker("setValue", colors.DEFAULT_COLOR.toRGBA());

  $("#state-edit, #state-remove").hide();
  $("#state-add").show();
  // Rebuild lists containing changed data
  fillStateList($("#state-list"), "state-edit-entry");
  fillStateList($("#state-set"), "set-state-entry");

  fillStateList($("#test-state-list"), "test-state-entry");
  fillStateList($("#new-state-list"), "new-state-list");
}
