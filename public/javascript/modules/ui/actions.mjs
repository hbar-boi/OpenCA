import {map, action} from "../engine.mjs";
import {draw, setCanvasState, canvas, cell} from "../ui.mjs";
import {update, setUICell} from "./cells.mjs";
import {getColorBox} from "./states.mjs";

// ================= UI STUFF FOR WORKING ON ACTIONS =====================

export function add() {
  $("#engine-start, #engine-stop, #engine-reset").prop("disabled", true);
  $("#action-menu").show();
  $("#main-menu").hide();

  setCanvasState(canvas.DISABLED)
  draw();
}

export function cancel(e) {
  $("#engine-start").prop("disabled", false);
  $("#main-menu").show();
  $("#action-menu").hide();

  setCanvasState(canvas.ENABLED);
  cell.ACTIVE = cell.FOCUS;
  setUICell(cell.TARGET, undefined);

  draw();
}

export function setActionTarget(e) {
  const target = +e.target.getAttribute("data");

  switch(target) {
    case action.TARGET_ONE:
      $("#target-distance").hide();
      $("#target-cell").show();

      setCanvasState(canvas.ENABLED);
      cell.ACTIVE = cell.TARGET;
      break;
    case action.TARGET_NEIGHBOR:
      $("#target-cell").html("Select target").hide();
      $("#target-distance").show();
      setCanvasState(canvas.DISABLED);
      setUICell(cell.TARGET, undefined);
      break;
  }

  const isOne = (target == action.TARGET_ONE);
  $("#mode-list .dropdown-item:gt(-3)").prop("disabled", isOne);
  $("#action-thresh").prop("disabled", isOne);

  draw();
}

export function save() {
  const target = $("#target-list").attr("active");
  const mode = $("#mode-list").attr("active");
  const testState = $("#test-state-list").attr("active");
  const newState = $("#new-state-list").attr("active");

  if(!target || !mode || !testState || !newState) return;

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
    if(!cell.target) return;

    entry.other = cell.target;
  }

  const current = cell.focus;
  map.data.actions[current[0]][current[1]].push(entry);

  $("#main-menu").show();
  $("#action-menu").hide();
  $("#engine-start").prop("disabled", false);

  setCanvasState(canvas.ENABLED);
  cell.ACTIVE = cell.FOCUS;
  setUICell(cell.TARGET, undefined);

  update();
  draw();
}

export function remove(e) {
  const id = e.target.parentElement.getAttribute("data");
  const focus = cell.focus;

  map.data.actions[focus[0]][focus[1]].splice(id, 1);

  update();
  draw();
}

export function share(e) {
  const id = e.target.parentElement.getAttribute("data");
  const current = cell.focus;
  const action = map.data.actions[current[0]][current[1]][id];

  for(let i = 0; i < map.size[0]; i++) {
    for(let j = 0; j < map.size[1]; j++) {
      if(i == current[0] && j == current[1]) continue;
      map.data.actions[i][j].push(action);
    }
  }
}

export function fillActionList() {
  const current = cell.focus;
  const actions = map.data.actions[current[0]][current[1]];

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
        content += getColorBox(map.states[item.test].color, true) +
          " in a neighborhood of " + item.distance + " cells make this " +
          getColorBox(map.states[item.new].color, true);
        break;
      case action.TARGET_ONE:
        const other = item.other;
        content += "(" + other[0] + ", " + other[1] + ") is ";
        if(item.mode == action.MODE_NOT) content += "not ";
        content += getColorBox(map.states[item.test].color, true) +
          " make this " + getColorBox(map.states[item.new].color, true);
        break;
    }
    entry.html(info.html(content)).append(menu[0].cloneNode(true));
    list.append(entry[0].cloneNode(true));
  });
}
