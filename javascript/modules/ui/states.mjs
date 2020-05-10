import {vec3} from "../vectors.mjs";
import {map} from "../engine.mjs";
import {colors, draw, getColorBox as box, settings} from "../ui.mjs";

// ================= UI STUFF FOR WORKING ON STATES =====================

export function save(id = undefined) { // Create new state or save edits
  const name = $("#state-name").val();
  const color = $("#state-color").colorpicker("getValue").match(/\d+/g);
  const state = {
    "name": name,
    "color": new vec3(color[0], color[1], color[2])
  };

  // State should have an unique name and color
  if(name == "" || map.states.some((e, i) => (
    new vec3(e.color).equals(state.color) && i != id))) return;

  // Create new state or update old one
  if(id == undefined) map.states.push(state);
  else map.states[id] = state;
  // Rebuild list
  update();
}

export function remove(id) { // Rip
  map.states.splice(id, 1);
  if(map.states.length == 0) {
    map.states.push({
      "name": "Default",
      "color": colors.DEFAULT_COLOR
    });
  }
  // Rebuild list
  update();
}

export function edit(e) { // Change UI to allow editing of state params
  const id = e.target.getAttribute("data");
  const state = map.states[id];
  const color = new vec3(state.color);
  // Prepare current state data
  $("#state-list").attr("active", id);
  $("#state-name").val(state.name);
  $("#state-color").colorpicker("setValue", color.toRGBA());

  $("#state-edit").show();
  $("#state-remove").show();
  $("#state-add").hide();
}

export function fillStateList(list, identifier) { // Fills a bootstrap dropdown
  list.html("");

  const entry = $("<button></button>");
  entry.addClass("dropdown-item d-flex justify-content-between " + identifier);

  map.states.forEach(function(item, i) {
    entry.attr("data", i);
    entry.html(item.name);
    entry.append(box(item.color));
    list.append(entry[0].cloneNode(true));
  });
}

export function update() {
  $("#state-name").val("");
  $("#state-color").colorpicker("setValue", "rgb(255, 255, 255)");

  $("#state-edit").hide();
  $("#state-remove").hide();
  $("#state-add").show();
  // Rebuild lists containing changed data
  fillStateList($("#state-list"), "state-edit-entry");
  fillStateList($("#state-set"), "set-state-entry");

  fillStateList($("#test-state-list"), "test-state-entry");
  fillStateList($("#new-state-list"), "new-state-list");

  draw();
}
