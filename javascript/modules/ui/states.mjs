import {vec2, vec3} from "../vectors.mjs";
import {map} from "../engine.mjs";
import {notifyChange} from "../renderer.mjs";
import {colors, draw, settings} from "../ui.mjs";

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
  if(id == undefined) {
    map.states.push(state);
    id = map.states.length - 1;
  } else map.states[id] = state;
  notifyChange(getCellsByStateId(id));
  // Rebuild list
  update();
}

export function remove(id) { // Rip
  // Cells with this id have to be reset...
  notifyChange(getCellsByStateId(id));

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

export function set(e) {
  const cell = settings.cell.focus;
  map.data.states[cell.x][cell.y] = e.target.getAttribute("data");
  notifyChange(cell);
}

function getCellsByStateId(id) {
  const cells = [];
  map.data.states.forEach((row, i) => {
    row.reduce((cells, item, j) => {
      if(item == id) cells.push(new vec2(i, j));
      return cells;
    }, cells);
  });
  return cells.flat();
}

export function getColorBox(color, inline = false) {
  const box = $("<span></span>").addClass("color-box")
    .css("background-color", new vec3(color).toRGBA());
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

export function update(doDraw = true) {
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

  if(doDraw) draw();
}
