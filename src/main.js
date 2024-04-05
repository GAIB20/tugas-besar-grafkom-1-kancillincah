let drawType = null;
let size = 0;
let isDown = false;
let shape = {
  line: [],
  square: [],
  rectangle: [],
  polygon: [],
};

let rgb = "#000000";
let editFlag = false;
let shapeSelection = []
let pointSelection = []
let indexPoint = []
let startFlag = false;
let animationId;
let animation;

/* ==== Element and event listener ==== */
const lineButton = document.getElementById("line");
lineButton.addEventListener("click", function () {
    drawType = "line";
});

const squareButton = document.getElementById("square");
squareButton.addEventListener("click", function () {
    drawType = "square";
});

const rectangleButton = document.getElementById("rectangle");
rectangleButton.addEventListener("click", function () {
    drawType = "rectangle";
});


/* ==== Edit Button ==== */ 
const editButton = document.getElementById("edit");
editButton.addEventListener("click", function () {
  editFlag = !editFlag
  
  if (editFlag) {
      editButton.innerHTML = '<i class="fas fa-edit"></i><p> Finish Edit </p>';
  } else {
      editButton.innerHTML = '<i class="fas fa-edit"></i><p> Edit object </p>';
      uncheckAllCheckboxes();
  }

  let checkedShapes = getCheckedShapes();
  let list = getSelectedObject(checkedShapes);
  console.log(checkedShapes);
  console.log(list);

  shapeSelection = list[0];
  pointSelection = list[1];
  indexPoint = list[2];

  console.log(shapeSelection);
  console.log(pointSelection);
  console.log(indexPoint);
  
  // rotation
  const rotationSlider = document.getElementById("rotation");
  rotationSlider.addEventListener("input", function () {
      rotateObject(shapeSelection, rotationSlider.value)
  });

  // dilatation
  const dilatationSlider = document.getElementById("dilatation");
  dilatationSlider.addEventListener("input", function () {
    dilateObject(shapeSelection, dilatationSlider.value)
  });

  // translation X
  const translationXSlider = document.getElementById("translationX");
  translationXSlider.addEventListener("input", function () {
    translateXObject(shapeSelection, pointSelection, indexPoint, translationXSlider.value)
  });

  // translation Y
  const translationYSlider = document.getElementById("translationY");
  translationYSlider.addEventListener("input", function () {
    translateYObject(shapeSelection, pointSelection, indexPoint, translationYSlider.value)
  });


  // color
  const colorSlider = document.getElementById("color");
  colorSlider.addEventListener("input", function () {
      colorObject(shapeSelection, pointSelection, indexPoint, colorSlider.value)
  });

  // animation
  const animationButton = document.getElementById("animation");
  animationButton.addEventListener("click", function () {
    startFlag = !startFlag
    if (startFlag) {
      animationButton.innerHTML = '<i class="fas fa-pause"></i><p> Stop Animation </p>';
      animation = animationObject(shapeSelection, pointSelection, indexPoint);
    } else {
        animationButton.innerHTML = '<i class="fas fa-play"></i><p> Start Animation </p>';
        animation.stopAnimation();
        animation = null;
    }
  });
});


/* ==== Canvas ==== */
const canvas = document.getElementById("canvas");
canvas.addEventListener("mousemove", function (e) {
  if (isDown) {
    let { x, y } = getMousePosition(canvas, e);
    onMove(drawType, x, y);
  }
});

canvas.addEventListener("mousedown", function (e) {
  let { x, y } = getMousePosition(canvas, e);
  isDown = true;
  draw(drawType, x, y);
});

canvas.addEventListener("mouseup", function (e) {
  isDown = false;
});

const colorInput = document.getElementById("color");
colorInput.addEventListener("input", function (e) {
  rgb = e.target.value;
});

const vertexShaderText = `
  precision mediump float;  
  attribute vec4 a_position;
  attribute vec4 vertColor;
  varying vec4 fragColor;

  void main() {
    fragColor = vertColor;
    gl_PointSize =100.0;
    gl_Position = a_position;
  }`;

const fragmentShaderText = `
  precision mediump float;
  varying vec4 fragColor;
  void main() {
    gl_FragColor = fragColor;
  }`;

const gl = canvas.getContext("webgl");
const program = createShaderProgram(vertexShaderText, fragmentShaderText);

function clear() {
  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function onMove(type, x, y) {
  let [w, h] = coor(canvas, x, y);
  if (type === "line") {
    /* get latest object and call on render move */
    let lenObject = shape["line"].length;
    shape["line"][lenObject - 1].onRenderMove(w, h);
  }
  else if (type === "square") {
    let lenObject = shape["square"].length;
    shape["square"][lenObject - 1].onRenderMove(w, h);
  }

  else if (type === "rectangle") {
    let lenObject = shape["rectangle"].length;
    shape["rectangle"][lenObject - 1].onRenderMove(w, h);
  }
  else {
    return;
  }
}

function loadShader(type, input) {
  let shader = gl.createShader(type);

  gl.shaderSource(shader, input);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      gl.getShaderInfoLog(vertexShader)
    );
    return null;
  }

  return shader;
}

function createShaderProgram(vertexShaderText, fragmentShaderText) {
  const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderText);
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderText);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

/* size is component per vertices */
function render(
  gl,
  program,
  attribute = "a_position",
  arr = [],
  size = 3,
  type = gl.FLOAT,
  isNormalized = gl.FALSE
) {
  const attributeLocation = gl.getAttribLocation(program, attribute);
  const buffer = gl.createBuffer();

  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);

  gl.useProgram(program);
  gl.enableVertexAttribArray(attributeLocation);
  gl.vertexAttribPointer(
    attributeLocation,
    size,
    type,
    isNormalized,
    stride,
    offset
  );
}

function renderColor(program, arr = [], size = 3) {
  render(gl, program, "vertColor", arr, size);
}

function renderVertex(program, arr = [], size = 3) {
  render(gl, program, "a_position", arr, size);
}

function draw(model, x, y) {
  let length = 0;
  let indexPoint = 0;
  if (model === "line") {
      shape.line.push(new Line(x, y, program));
      length = shape.line.length;
      indexPoint = shape.line[length - 1].points.length;
  } else if (model === "square") {
      shape.square.push(new Square(x, y, program));
      length = shape.square.length;
      indexPoint = shape.square[length - 1].points.length;
  } else if (model === "rectangle") {
      shape.rectangle.push(new Rectangle(x, y, program));
      length = shape.rectangle.length;
      indexPoint = shape.rectangle[length - 1].points.length;
  } else {
      return;
  }
  getObject(model, length, indexPoint);
  getAllPoint(model, length)
}

function resetState() {
  shape.line = [];
  shape.polygon = [];
  shape.rectangle = [];
  shape.square = [];
  polyPoints = [];
}

function renderObject() {
  clear();
  let keys = Object.keys(shape);
  for (let key of keys) {
    for (let model of shape[key]) {

      model.render(program);
      
    }
  }

  /* render per frame (1s / 60 frame) */
  window.requestAnimFrame(function (program) {
    renderObject(program);
  });
}

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

renderObject(program);




