import {meta, map} from "../engine.mjs";

export const boundaries = {
  "0": rect,
  "1": vcyl,
  "2": hcyl,
  "3": torus
}

function rect() {
  meta.start.clampFloor(0, 0);
  meta.stop.clampCeil(map.size[0] - 1, map.size[1] - 1);
}

function vcyl() {
  meta.start[0] = Math.max(meta.start[0], 0);
  meta.stop[0] = Math.min(meta.stop[0], map.size[0] - 1);
}

function hcyl() {
  meta.start[1] = Math.max(meta.start[1], 0);
  meta.stop[1] = Math.min(meta.stop[1], map.size[1] - 1);
}

function torus() {

}
