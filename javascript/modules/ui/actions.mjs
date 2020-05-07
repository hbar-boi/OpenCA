import {map, action} from "../engine.mjs";
import {draw, getColorBox as box} from "../ui.mjs";
import {update} from "./cells.mjs";

// ================= UI STUFF FOR WORKING ON ACTIONS =====================

export function add() {
  $("#engine-start, #engine-stop, #engine-reset").prop("disabled", true);
  map.canvas.disabled = true;
  $("#action-menu").show();
  $("#main-menu").hide()

  draw();
}

export function cancel(e) {
  $("#engine-start").prop("disabled", false);
  map.canvas.disabled = false;
  $("#main-menu").show();
  $("#action-menu").hide();
  map.cell.target = undefined;

  draw();
}

export function setActionTarget(e) {
  const target = +e.target.getAttribute("data");
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

export function save() {
  const target = $("#target-list").attr("active");
  const mode = $("#mode-list").attr("active");
  const testState = $("#test-state-list").attr("active");
  const newState = $("#new-state-list").attr("active");

  if(target == undefined || mode == undefined ||
    testState == undefined || newState == undefined) return;

  const entry = {
    "target": +target,
    "mode": +mode,
    "test": +testState,
    "new": +newState
  };

  const distance = $("#target-distance").val();
  const threshold = $("#action-thresh").val();

  if(target == action.TARGET_NEIGHBOR) {
    if(distance == "" || threshold == "") return;
    entry.distance = +distance;
    entry.threshold = +threshold;
  } else {
    if(map.cell.target == undefined) return;
    entry.other = map.cell.target;
  }

  const current = map.cell.focus;
  map.data.actions[current.x][current.y].push(entry);

  map.canvas.disabled = false;
  map.cell.target = undefined;
  $("#main-menu").show();
  $("#action-menu").hide();
  $("#engine-start").prop("disabled", false);

  update();
}

export function remove(e) {
  const id = e.target.parentElement.getAttribute("data");
  const focus = map.cell.focus;
  map.data.actions[focus.x][focus.y].splice(id, 1);

  update();
}

export function share(e) {
  const id = e.target.parentElement.getAttribute("data");
  const cell = map.cell.focus;
  const action = map.data.actions[cell.x][cell.y][id];
  for(let i = 0; i < map.grid.x; i++) {
    for(let j = 0; j < map.grid.y; j++) {
      if(i == cell.x && j == cell.y) continue;
      map.data.actions[i][j].push(action);
    }
  }
}

export function fillActionList() {
  const cell = map.cell.focus;
  const actions = map.data.actions[cell.x][cell.y];

  const list = $("#cell-actions").html("");
  const entry = $("<li></li>").addClass("list-group-item");
  const deleteButton = $("<button></button>")
    .addClass("btn btn-danger action-delete").html("Delete");
  const shareButton = $("<button></button>")
    .addClass("btn btn-primary action-share").html("Apply to all");
  const menu = $("<div></div>").append(shareButton).append(deleteButton)
    .addClass("action-menu justify-content-around");
  const info = $("<span></span>").addClass("action-info");

  actions.forEach((item, i) => {
    menu.attr("data", i);
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
        content += box(map.states[item.test].color, true) +
          " in a neighborhood of " + item.distance + " cells make this " +
          box(map.states[item.new].color, true);
        break;
      case action.TARGET_ONE:
        const other = item.other;
        content += "(" + other.x + ", " + other.y + ") is ";
        if(item.mode == action.MODE_NOT) content += "not ";
        content += box(map.states[item.test].color, true) +
          " make this " + box(map.states[item.new].color, true);
        break;
    }
    entry.html(info.html(content)).append(menu[0].cloneNode(true));
    list.append(entry[0].cloneNode(true));
  });
}
