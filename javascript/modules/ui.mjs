import {vec2, vec3} from "./vectors.mjs";
import {draw as _draw} from "./renderer.mjs";
import {map} from "./engine.mjs";

// Handle all UI stuff

export function saveState(id=undefined, remove=false) {
  const name = $("#state-name").val();
  if(name == "") return;
  const color = $("#state-color").colorpicker("getValue").match(/\d+/g);
  const state = {
    name: name,
    color: new vec3(color[0], color[1], color[2])
  };

  if(id == undefined) map.states.push(state);
  else map.states[id] = state;

  $("#edit-state").addClass("d-none");
  $("#remove-state").addClass("d-none");
  $("#add-state").removeClass("d-none");

  update();
}

export function removeState(id) {
  map.states.splice(id, 1);

  if(map.states.length == 0) {
    map.states.push({
      name: "Default",
      color: new vec3(255, 255, 255)
    });
  }

  $("#edit-state").addClass("d-none");
  $("#remove-state").addClass("d-none");
  $("#add-state").removeClass("d-none");

  update();
}

export function editState(event) {
  const id = event.target.getAttribute("state-id");
  const state = map.states[id];
  const color = state.color;
  $("#state-name").val(state.name).attr("state-id", id);
  $("#state-color").colorpicker("setValue",
    "rgb(" + color.x + ", "+  color.y + ", " + color.z + ")"
  );

  $("#edit-state").removeClass("d-none");
  $("#remove-state").removeClass("d-none");
  $("#add-state").addClass("d-none");
}

export function cellClick(event) {
  const cell = targetCell(event);
  const focus = map.cell.focus;

  if(!cell.equals(focus)) map.cell.focus = cell;
  else map.cell.focus = undefined;

  const msg = $("#current-cell");

  if(map.cell.focus == undefined) msg.html("Select cell");
  else msg.html("Current cell: " + cell.x + " - " + cell.y);
  draw();
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
  const list = $("#state-list");
  list.html("");
  const entry = $("<button></button>");
  entry.addClass("dropdown-item state");
  map.states.forEach(function(item, i) {
    entry.attr("state-id", i);
    entry.html(item.name);
    list.append(entry[0].cloneNode(true));
  });

  $(".state").click(function(event) {
    editState(event);
  });
}

export function draw() {
  const grid = $("#grid-display").prop("checked");
  const ctx = $("#frame")[0].getContext("2d");

  _draw(ctx, map, grid);
}
