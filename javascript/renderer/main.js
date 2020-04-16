function main() {
  const canvas = document.getElementById('frame');
  var gl = canvas.getContext('webgl');

  map = {
    size: {
      x: 50,
      y: 40,
      thickness: 0.001
    }
  };

  let render = new Render(gl, map);
}

window.onload = main;
