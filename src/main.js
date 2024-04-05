/* ==== Element and event listener ==== */
let isEditing = false;

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

const editButton = document.getElementById("edit");
editButton.addEventListener("click", function () {
  isEditing = true;
  if (isEditing) {
    editButton.textContent = "Stop edit";
  } else {
    editButton.textContent = "Edit";
    uncheckObject();
  }
  document.getElementById("dilatation").value = "1";
  document.getElementById("shearX").value = "0";
  document.getElementById("shearY").value = "0";
  drawType = "edit";
  editObject();
});

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", function (e) {
  if (!isEditing) {
    location.reload();
  } else {
    alert("Click finish button first!");
  }
});

const scaleSlider = document.getElementById("size");
scaleSlider.addEventListener("input", function (e) {
  size = parseInt(scaleSlider.value);
});


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

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  if (!isEditing) {
    let file = save();
    let link = document.createElement("a");
    link.setAttribute("download", "save.json");
    link.href = file;
    document.body.appendChild(link);
    link.click();
    alert("File saved");
  } else {
    alert("Click finish button first!");
  }
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
  console.log("draw model", model, "at", x, y);
  
  if (model === "line") {
    shape.line.push(new Line(x, y, program));
    printModels("line", shape.line);
    console.log(shape.line);
  } 
  else if (model === "square") {
    shape.square.push(new Square(x, y, program));
    console.log(shape.square);
    printModels("square", shape.square);
  }
  else if (model === "rectangle") {
    shape.rectangle.push(new Rectangle(x, y, program));
    printModels("rectangle", shape.rectangle);
    console.log(shape.rectangle);
  }
  else {
    return;
  }
}



function resetState() {
  shape.line = [];
  shape.polygon = [];
  shape.rectangle = [];
  shape.square = [];
  polyPoints = [];
}

function save() {
  let jsonFile = JSON.stringify(models);
  let data = new Blob([jsonFile], { type: "application/json" });

  /* if already exists remove */
  if (savedFile !== null) {
    window.URL.revokeObjectURL(savedFile);
  }

  savedFile = window.URL.createObjectURL(data);
  return savedFile;
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




