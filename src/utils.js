function getMousePosition(canvas, e) {
  const position = canvas.getBoundingClientRect();
  const x = e.clientX - position.x;
  const y = e.clientY - position.y;
  return { x, y };
}

function getRGB(color) {
  //convert #ffffff to rgb
  const red = parseInt(color.substr(1, 2), 16);
  const green = parseInt(color.substr(3, 2), 16);
  const blue = parseInt(color.substr(5, 2), 16);

  //convert rgb to 0 to 1
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  return { r, g, b };
}


function coor(canvas, x, y) {
  const position = canvas.getBoundingClientRect();
  const [width, height] = [position.width, position.height];

  /* Converts from coordinate to zero to one */
  /* converts zero to one to zero to two */
  /* Converts zero to two to -1 to 1 */
  const realWidth = (x / width) * 2 - 1;
  const realHeight = (y / height) * -2 + 1;

  return [realWidth, realHeight];
}

function centroid(matrix) {
  let x = 0;
  let y = 0;
  let vertexCount = matrix.length;
  for (i = 0; i < vertexCount; i++) {
    x += matrix[i][0];
    y += matrix[i][1];
  }

  x = x / vertexCount;
  y = y / vertexCount;

  return [x, y];
}

/* flatten 2d array to 1d */
function flatten(matrix) {
  let len = matrix.length;
  let n = len;
  let isArr = false;

  if (Array.isArray(matrix[0])) {
    isArr = true;
    n *= matrix[0].length;
  }

  let result = new Float32Array(n);
  let cur = 0;

  if (isArr) {
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        result[cur++] = matrix[i][j];
      }
    }
  } else {
    for (let i = 0; i < len; i++) {
      result[cur++] = matrix[i];
    }
  }

  return result;
}