import {vec2, vec3} from "./vectors.mjs";
import {draw as _draw} from "./renderer.mjs";
import {map} from "./engine.mjs";

// Handle all UI stuff

export function saveState(id=undefined) {
  const name = $("#state-name").val();
  const color = $("#state-color").colorpicker("getValue").match(/\d+/g);
  const state = {
    "name": name,
    "color": new vec3(color[0], color[1], color[2])
  };

  if(name == "" || map.states.some( // State should have a name and a new color
    e => new vec3(e.color).equals(state.color))
  ) return;

  if(id == undefined) map.states.push(state);
  else map.states[id] = state;

  update();
}

export function removeState(id) {
  map.states.splice(id, 1);

  if(map.states.length == 0) {
    map.states.push({
      "name": "Default",
      "color": new vec3(255, 255, 255)
    });
  }

  update();
}

export function editState(event) {
  const id = event.target.getAttribute("state-id");
  const state = map.states[id];
  const color = new vec3(state.color);
  $("#state-list").attr("state-id", id);
  $("#state-name").val(state.name);
  $("#state-color").colorpicker("setValue", color.toRGBA());

  $("#edit-state").removeClass("d-none");
  $("#remove-state").removeClass("d-none");
  $("#add-state").addClass("d-none");
}

function setState(event) {
  const id = event.target.getAttribute("state-id");
  const cell = map.cell.focus;
  map.data[cell.x][cell.y].state = +id;
}

export function cellClick(event) {
  const cell = targetCell(event);
  const focus = map.cell.focus;

  if(!cell.equals(focus)) map.cell.focus = cell;
  else map.cell.focus = undefined;

  const list = $("#cell-actions");
  list.html("");

  if(map.cell.focus == undefined) {
    $("#current-cell").html("Select cell");
    $("#actions").addClass("d-none");
  } else {
    $("#current-cell").html("Current cell: (" + cell.x + ", " + cell.y + ")");
    $("#actions").removeClass("d-none");

    const actions = map.data[cell.x][cell.y].actions;
    const action = $("<li></li>");
    action.addClass("list-group-item");
    actions.forEach(function(item, i) {
      action.html("IF: " + item.target + " IS " + item.condition + " THEN " + item.result);
      list.append(action[0].cloneNode(true));
    });
  }

  if(event != undefined) draw();
}

export function cellHover(event) {
  const cell = targetCell(event);
  const hover = map.cell.hover;
  switch(event.type) {
    case "mousemove":
      if(!cell.equals(hover)) {
        map.cell.hover = cell;
        return;
      }
      break;
    case "mouseout":
      map.cell.hover = undefined;
      break;
  }

  draw();
}

function targetCell(event) {
  const rel = new vec2(
    event.pageX - map.canvas.left,
    event.pageY - map.canvas.top
  );
  const box = map.cell.size + (map.cell.margin * 2);
  return new vec2(
    Math.min(map.grid.x - 1, Math.max(0, Math.floor(rel.y / box))),
    Math.min(map.grid.y - 1, Math.max(0, Math.floor(rel.x / box)))
  );
}

export function update() {
  $("#state-name").val("");
  $("#state-color").colorpicker("setValue", "rgb(255, 255, 255)");

  $("#edit-state").addClass("d-none");
  $("#remove-state").addClass("d-none");
  $("#add-state").removeClass("d-none");

  populateStateList($("#state-list"), "edit-state-entry");
  $(".edit-state-entry").click(function(event) {
    editState(event);
  });

  populateStateList($("#state-set"), "set-state-entry");
  $(".set-state-entry").click(function(event) {
    setState(event);
  });

  draw();
}

function populateStateList(list, identifier) {
  list.html("");

  const entry = $("<button></button>");
  entry.addClass("dropdown-item d-flex justify-content-between " + identifier);
  const color = $("<span></span>");
  color.addClass("color-box");

  map.states.forEach(function(item, i) {
    color.css("background-color", new vec3(item.color).toRGBA());
    entry.attr("state-id", i);
    entry.html(item.name);
    entry.append(color[0].cloneNode(true));
    list.append(entry[0].cloneNode(true));
  });
}

export function draw() {
  const grid = $("#grid-display").prop("checked");
  const ctx = $("#frame")[0].getContext("2d");

  _draw(ctx, map, grid);
}
