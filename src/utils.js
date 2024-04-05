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

function orientation(p, q, r) {
  const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
  if (val === 0) return 0;
  return val > 0 ? 1 : -1;
}

function distance(p, q) {
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  return dx * dx + dy * dy; 
}

function convexHull(points) {
  const n = points.length;
  if (n < 3) return [];

  let minY = Infinity;
  let minIndex = -1;
  for (let i = 0; i < n; i++) {
      if (points[i][1] < minY || (points[i][1] === minY && points[i][0] < points[minIndex][0])) {
          minY = points[i][1];
          minIndex = i;
      }
  }

  if (minIndex !== 0) {
      [points[0], points[minIndex]] = [points[minIndex], points[0]];
  }

  points.sort((a, b) => {
      const angle = orientation(points[0], a, b);
      if (angle === 0) {
          return distance(points[0], a) - distance(points[0], b);
      }
      return angle;
  });

  const stack = [points[0], points[1]];

  for (let i = 2; i < n; i++) {
      let top = stack.length - 1;
      while (top > 0 && orientation(stack[top - 1], stack[top], points[i]) !== -1) {
          stack.pop();
          top--;
      }
      stack.push(points[i]);
  }

  return stack;
}