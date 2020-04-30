import {vec2, vec3} from "./vectors.mjs";
import {draw as _draw} from "./renderer.mjs";
import {map, action} from "./engine.mjs";

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

// ================= UI STUFF FOR WORKING ON ACTIONS =====================

export function setActionTarget(event) {
  const target = +event.target.getAttribute("data");
  switch(target) {
    case action.TARGET_ONE:
      map.canvas.disabled = false;
      $("#target-distance").hide();
      $("#target-cell").show();
      break;
    case action.TARGET_NEIGHBOR:
      map.cell.target = undefined;
      $("#target-cell").html("Select target").hide();
      $("#target-distance").show();
      break;
  }
  $("#mode-list .dropdown-item:gt(-3)").prop("disabled",
    target == action.TARGET_ONE);
  $("#action-thresh").prop("disabled",
    target == action.TARGET_ONE);

  draw();
}

export function saveAction() {
  const target = +$("#target-list").attr("active");
  const mode = +$("#mode-list").attr("active");
  const entry = {
    "target": target,
    "mode": mode,
    "test": +$("#test-state-list").attr("active"),
    "new": +$("#new-state-list").attr("active")
  };
  if(target == action.TARGET_NEIGHBOR) {
    entry.distance = +$("#target-distance").val();
    entry.threshold = +$("#action-thresh").val();
  } else entry.other = map.cell.target;

  const current = map.cell.focus;
  map.data[current.x][current.y].actions.push(entry);

  populateActionList($("#cell-actions"), map.cell.focus);

  map.canvas.disabled = false;
  $("#main-menu").show();
  $("#action-menu").hide();
  map.cell.target = undefined;

  update();
}

export function removeAction(event) {
  const id = event.target.getAttribute("action-id");
  const focus = map.cell.focus;
  map.data[focus.x][focus.y].actions.splice(id, 1);

  update();
}

// ================= UI STUFF FOR WORKING ON STATES =====================

export function saveState(id = undefined) { // Create new state or save edits
  const name = $("#state-name").val();
  const color = $("#state-color").colorpicker("getValue").match(/\d+/g);
  const state = {
    "name": name,
    "color": new vec3(color[0], color[1], color[2])
  };

  // State should have an unique name and color
  if(name == "" || map.states.some(
    e => new vec3(e.color).equals(state.color))
  ) return;

  // Create new state or update old one
  if(id == undefined) {
    map.states.push(state);
  }
  else map.states[id] = state;
  // Rebuild list
  update();
}

export function removeState(id) { // Rip
  map.states.splice(id, 1);
  if(map.states.length == 0) {
    map.states.push({
      "name": "Default",
      "color": new vec3(255, 255, 255)
    });
  }
  // Rebuild list
  update();
}

export function editState(event) { // Change UI to allow editing of state params
  const id = event.target.getAttribute("data");
  const state = map.states[id];
  const color = new vec3(state.color);
  // Prepare current state data
  $("#state-list").attr("active", id);
  $("#state-name").val(state.name);
  $("#state-color").colorpicker("setValue", color.toRGBA());

  $("#edit-state").show();
  $("#remove-state").show();
  $("#add-state").hide();
}

// =============== UI STUFF FOR CELL INTERACTIONS ===================

export function cellClick(event) {
  // Need a way to tell if we're working on the focus cell
  // or the target cell. This is determined by mode.
  // This way we can use the same function to select two different cells
  // in different moments.
  const setActive = function(which, set) {
    // which = true -> working on focus cell.
    // which = false -> working on target cell.
    if(which) map.cell.focus = set;
    else map.cell.target = set;
  }

  const mode = $("#main-menu").is(":visible");
  const active = mode ? map.cell.focus : map.cell.target;
  const cell = eventCell(event);

  if(cell.equals(active)) { // Clicked on active cell. Remove selection
    setActive(mode, undefined);
    if(mode) { // If we are in focus mode do UI stuff for focus mode
      $("#cell-actions").html("");
      $("#current-cell").html("Select cell");
      $("#cell-menu").hide();
    } else { // Same for target mode
      $("#target-cell").html("Select target");
    }
  } else { // Clicked on another cell. Move selection
    setActive(mode, cell);
    if(mode) { // Update cell actions 'n shit
      $("#current-cell").html("Active cell: (" + cell.x + ", " + cell.y + ")");
      $("#cell-menu").show();

      populateActionList($("#cell-actions"), cell);
    } else { // Update target stuff
      $("#target-cell").html("Target is (" + cell.x + ", " + cell.y + ")");
    }
  }

  draw();
}

export function cellHover(event) { // Cell with cursor on changes color
  const cell = eventCell(event);
  const hover = map.cell.hover;
  switch(event.type) {
    case "mousemove":
      if(!cell.equals(hover)) {
        map.cell.hover = cell;
        return;
      }
      break;
    case "mouseout":
      map.cell.hover = undefined; // Reset object
      break;
  }

  draw();
}

function eventCell(event) { // Returns a vec2 containing indices for cell
  const rel = new vec2( // Translate to top-left of canvas
    event.pageX - map.canvas.left,
    event.pageY - map.canvas.top
  );
  const box = map.cell.size + (map.cell.margin * 2);
  return new vec2( // Just divide and clamp to get index. Easy as that.
    Math.min(map.grid.x - 1, Math.max(0, Math.floor(rel.y / box))),
    Math.min(map.grid.y - 1, Math.max(0, Math.floor(rel.x / box)))
  );
}

// ================== RANDOM UTILS FOR UI =============================

export function update() { // Reset UI after some major change
  $("#state-name").val("");
  $("#state-color").colorpicker("setValue", "rgb(255, 255, 255)");

  $("#edit-state").hide();
  $("#remove-state").hide();
  $("#add-state").show();
  // Rebuild lists containing changed data
  populateStateList($("#state-list"), "edit-state-entry");
  $(".edit-state-entry").click(function(event) {
    editState(event);
  });

  populateStateList($("#state-set"), "set-state-entry");
  $(".set-state-entry").click(function(event) {
    const cell = map.cell.focus;
    map.data[cell.x][cell.y].state = event.target.getAttribute("data");
  });

  populateStateList($("#test-state-list"), "test-state-entry");
  populateStateList($("#new-state-list"), "new-state-list");

  if(map.cell.focus != undefined)
    populateActionList($("#cell-actions"), map.cell.focus);

  // This is needed to make Bootstrap dropdowns work as selects
  $("#state-list, #mode-list, #target-list, #test-state-list, #new-state-list")
    .find(".dropdown-item").click(function(event) {
    const active = +event.target.getAttribute("data");
    event.target.parentElement.setAttribute("active", active);
  });

  draw();
}

function populateStateList(list, identifier) { // Fills a bootstrap dropdown
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

function populateActionList(list, cell) { // Fills a bootstrap list
  list.html("");

  const actions = map.data[cell.x][cell.y].actions;
  const entry = $("<li></li>").addClass("list-group-item");
  actions.forEach(function(item, i) {
    entry.attr("action-id", i);
    let content = "If ";
    switch(item.target) {
      case action.TARGET_NEIGHBOR:
        switch(item.mode) {
          case action.MODE_LESS:
            content += "less than ";
            break;
          case action.MODE_MORE:
            content += "more than ";
            break;
          default:
            content += "exactly ";
            break;
        }
        if(item.threshold != 1) content += item.threshold + " are ";
        else content += item.threshold + " is ";
        if(item.mode == action.MODE_NOT) content += "not ";
        content += getColorBox(map.states[item.test].color, true) +
          " in a neighborhood of " + item.distance + " cells make this " +
          getColorBox(map.states[item.new].color, true);
        break;
      case action.TARGET_ONE:
        const other = item.other;
        content += "(" + other.x + ", " + other.y + ") is ";
        if(item.mode == action.MODE_NOT) content += "not ";
        content += getColorBox(map.states[item.test].color, true) +
          " make this " + getColorBox(map.states[item.new].color, true);
        break;
    }
    entry.html($("<span></span>").addClass("item-wrapper").html(content));
    list.append(entry[0].cloneNode(true));
  });

  list.find(".list-group-item").click(function(event) {
    removeAction(event)
  });
}

function getColorBox(color, inline = false) {
  const box = $("<span></span>").addClass("color-box")
    .css("background-color", new vec3(color).toRGBA());
  if(inline) return box.addClass("color-box-inline")[0].outerHTML;
  else return box;
}

export function draw() { // Gets context and calls renderer's draw()
  const grid = $("#grid-display").prop("checked");
  const ctx = $("#frame")[0].getContext("2d");

  _draw(ctx, map, grid);
}
