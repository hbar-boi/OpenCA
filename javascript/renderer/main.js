function main() {
  const canvas = document.getElementById('frame');
  var gl = canvas.getContext('webgl');

  map = {
    size: {
      x: 5,
      y: 6,
      thickness: 0.001
    }
  };

  let render = new Render(gl, map);
}

window.onload = main;
