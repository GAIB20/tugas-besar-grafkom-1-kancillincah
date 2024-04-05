let drawType = null;
let size = 0;
let isDown = false;
let shape = {
  line: [],
  square: [],
  rectangle: [],
  polygon: [],
};
let polyPoints = [];
let isPolygonActve = false;
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

const polygonButton = document.getElementById("polygon");
polygonButton.addEventListener("click", function () {
  if (isPolygonActve == true) {
    shape["polygon"][shape["polygon"].length - 1].vertexRemoved();
    polyPoints = [];
    isPolygonActve = false;
    drawType = "";
    getObject("polygon", shape["polygon"].length, shape["polygon"][shape["polygon"].length - 1].points.length);
    getAllPoint("polygon", shape["polygon"].length);
  }
  else {
    drawType = "polygon";
  }
  
});
const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  save();
});

const clearButton = document.getElementById("clear-canvas");
clearButton.addEventListener("click", function (e) {
    if (!editFlag) {
        location.reload();
    }
});

const loadButton = document.getElementById("load");
loadButton.addEventListener("click", function () {
  load();
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
  if (drawType == "polygon") {
    if (polyPoints.length > 0) {
      let { x, y } = getMousePosition(canvas, e);
      onMove(drawType, x, y);
    }
  }else {
    if (isDown) {
      let { x, y } = getMousePosition(canvas, e);
      onMove(drawType, x, y);
    }
 }
});

canvas.addEventListener("mousedown", function (e) {
  let { x, y } = getMousePosition(canvas, e);
  isDown = true;
  if (drawType != "polygon") {
    draw(drawType, x, y);
  }else if (drawType == "polygon"){
    if (polyPoints.length == 0) {
      console.log("start");
      let [w, h] = coor(canvas, x, y);
      draw(drawType, x, y);
      polyPoints.push([w, h]);
    }else {
      let [w, h] = coor(canvas, x, y);
      polyPoints.push([w, h]);
      isPolygonActve = true;
      addVertexPolygon(x, y);
    }
  }
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

window.onload = function start () {
  clear();
};


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
  else if (type === "polygon") {
    let lenObject = shape["polygon"].length;
    shape["polygon"][lenObject - 1].onRenderMove(w, h);
  }
  else {
    return;
  }
}

function addVertexPolygon(x, y) {
  let [w, h] = coor(canvas, x, y);
  let lenObject = shape["polygon"].length;
  shape["polygon"][lenObject - 1].vertexAdded(w, h);
  // console.log(shape["polygon"][lenObject - 1].points);
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
  } else if (model === "polygon") {
      shape.polygon.push(new Polygon(x, y, program));
      length = shape.polygon.length;
      indexPoint = shape.polygon[length - 1].points.length;
  }
  else {
      return;
  }
  if (drawType != "polygon") {
    getObject(model, length, indexPoint);
    console.log(model, length, indexPoint);
    getAllPoint(model, length)
  }
}

function save() {
  const shapeJSON = JSON.stringify(shape, null, 2);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([shapeJSON], {
    type: "text/plain"
  }))
  a.setAttribute("download", "shape.json");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function drawShape(model, points, colors, centroid) {
  let obj;
  switch (model) {
    case "line":
      obj = new Line(0, 0);
      break;
    case "square":
      obj = new Square(0, 0);
      break;
    case "rectangle":
      obj = new Rectangle(0, 0);
      break;
    case "polygon":
      obj = new Polygon(polyPoints);
      break;
    default:
      console.error("Invalid shape model");
      return;
  }

  obj.points = points;
  obj.colors = colors;
  obj.centroid = centroid;

  shape[model].push(obj);

  // Render the object
  obj.render(program);

  // Update object selection and points
  getObject(model, shape[model].length, obj.points.length);
  getAllPoint(model, shape[model].length);
}


function load() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
      const data = JSON.parse(reader.result);

      // Clear existing shapes before loading new ones
      reset();
      clearGetObject();

      // Iterate through each shape type in the loaded data
      Object.keys(data).forEach(model => {
        data[model].forEach(shapeData => {
          const points = shapeData.points;
          const colors = shapeData.colors;
          const centroid = shapeData.centroid;
          drawShape(model, points, colors, centroid);
        });
      });
      renderObject();
      displayFileName(file.name);
    };

    reader.readAsText(file);
  };

  input.click();
}

function displayFileName(fileName) {
  const namafileElement = document.getElementById("namafile");
  namafileElement.innerText = fileName;
}


function reset() {
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




