import {update} from "../main.js";
import {map} from "./engine.mjs";
import {vec3} from "./vectors.mjs";

export function exportData() {
  const data = "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(map));
  const anchor = $("#io-export-anchor");
  anchor.attr("href", data).attr("download", "automaton.oca");
  anchor[0].click();
}

export function importData() {
  const files = $("#io-import-file")[0].files;
  if(!files.length) return;
  const reader = new FileReader();
  reader.onload = () => {
    const imported = JSON.parse(reader.result);
    map.size = imported.size;
    map.data = imported.data;

    imported.states.forEach((item, i) => {
      item.color = new vec3(
        item.color[0],
        item.color[1],
        item.color[2]);
      map.states[i] = item;
    });
    
    update(false);
  }
  reader.readAsText(files.item(0))
}
