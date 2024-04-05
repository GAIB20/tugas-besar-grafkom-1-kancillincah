let tempRotation = 0;
let tempDilataion = 1;
let tempTranslationX = 0;
let tempTranslationY = 0;

function getObject(shape, indexObject, indexPoint) {
    var list = document.getElementById("List");
    var object = document.createElement("div");
    object.innerHTML = `
        <input type="checkbox" id="${shape}${indexObject}" name="${shape}${indexObject}" value="${shape}${indexObject}" >
        <label for="${shape}${indexObject}">${shape}[${indexObject}]</label><br>
    `;
    list.appendChild(object);

    for (let i = 1; i <= indexPoint; i++) {
        let point = document.createElement("li");
        point.innerHTML = `
        <input type="checkbox" id="${shape}${indexObject}point${i}" name="${shape}${indexObject}point" value="${shape}${indexObject}point${i}">
        <label for="${shape}${indexObject}point${i}">point[${i}]</label><br>
        `;
        object.appendChild(point);
    }
}

function clearGetObject() {
    var list = document.getElementById("List");
    list.innerHTML = ''; // Clear all child elements
}

function getAllPoint(shape, indexObject) {
    let objectSelection = document.getElementById(`${shape}${indexObject}`);
    objectSelection.addEventListener("change", function () {
        if (objectSelection.checked) {
          document
            .querySelectorAll(`input[name="${shape}${indexObject}point"]`)
            .forEach((item) => {
              item.checked = true;
            });
        } else {
          document
            .querySelectorAll(`input[name="${shape}${indexObject}point"]`)
            .forEach((item) => {
              item.checked = false;
            });
        }
      });
}

function getCheckedShapes() {
    const checkedShapes = [];
    
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            checkedShapes.push(checkbox.value);
        }
    });
    
    return checkedShapes;
}

function uncheckAllCheckboxes() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}

function getSelectedObject(array) {
    shapeSelection = [];
    pointSelection = [];
    modelInserted = [];
    indexPoint = [];
  
    for (let i = 0; i < array.length; i++) {
      let m = array[i][0];
      console.log(shape.line)
        if (m == "l") {
            if (array[i].length < 11) {
                shapeSelection.push(shape.line[array[i][4] - 1]);
                console.log(array[i][4] - 1);
                modelInserted.push(array[i]);
            } else {
                let point = array[i].split("point");
                if (!modelInserted.includes(point[0])) {
                    pointSelection.push(shape.line[array[i][4] - 1]);
                    modelInserted.push(array[i]);
                    indexPoint.push(point[1])
                }   
            }
        } else if (m == "s") {
            if (array[i].length < 13) {
                shapeSelection.push(shape.square[array[i][6] - 1]);
                modelInserted.push(array[i]);
            } else {
                let point = array[i].split("point");
                if (!modelInserted.includes(point[0])) {
                    pointSelection.push(shape.square[array[i][6] - 1]);
                    modelInserted.push(array[i]);
                    indexPoint.push(point[1])    
                }
            }
        } else if (m == "r") {
            if (array[i].length < 16) {
                shapeSelection.push(shape.rectangle[array[i][9] - 1]);
                modelInserted.push(array[i]);
            } else {
                let point = array[i].split("point");
                if (!modelInserted.includes(point[0])) {
                    pointSelection.push(shape.rectangle[array[i][9] - 1]);
                    modelInserted.push(array[i]);
                    indexPoint.push(point[1])    
                }   
            }
        } else if (m == "p") {
            if (array[i].length < 14) {
                shapeSelection.push(shape.polygon[array[i][7] - 1]);
                modelInserted.push(array[i]);
            } else {
                let point = array[i].split("point");
                if (!modelInserted.includes(point[0])) {
                    pointSelection.push(shape.polygon[array[i][7] - 1]);
                    modelInserted.push(array[i]);
                    indexPoint.push(point[1])
                }
            }
        }
    }
    return [shapeSelection, pointSelection, indexPoint];
}

function rotateObject(shapeSelection, value) {
    console.log(value);
    let rotation = (value * Math.PI) / 180;

    shapeSelection.forEach(shape => {
        console.log(shape);
        let center = centroid(shape.points);

        // Rotation on coordinates
        shape.points.forEach(point => {
            const x = point[0] - center[0];
            const y = point[1] - center[1];

            point[0] =
                x * Math.cos(rotation - tempRotation) -
                y * Math.sin(rotation - tempRotation) +
                center[0];
            point[1] =
                x * Math.sin(rotation - tempRotation) +
                y * Math.cos(rotation - tempRotation) +
                center[1];
        });
    });

    tempRotation = rotation;
}

function dilateObject(shapeSelection, value) {
    console.log(value);
    let dilatation = value;

    shapeSelection.forEach(shape => {
        let center = centroid(shape.points);

        // Dilation on coordinates
        shape.points.forEach(point => {
            const x = point[0] - center[0];
            const y = point[1] - center[1];

            point[0] = center[0] + ((point[0] - center[0]) * dilatation) / tempDilataion;
            point[1] = center[1] + ((point[1] - center[1]) * dilatation) / tempDilataion;
        });
    });
    tempDilataion = dilatation;
}


function translateXObject(shapeSelection, pointSelection, indexPoint, value) {
    console.log(value);
    let translationX = value;

    console.log("shapeSelection", shapeSelection);
    
    // Translate shapes in shapeSelection
    translateXShapes(shapeSelection, translationX);

    // Translate points in pointSelection
    translateXPoints(pointSelection, indexPoint, translationX);

    tempTranslationX = translationX;
}

// Function to translate shapes in shapeSelection
function translateXShapes(shapeSelection, translationX) {
    shapeSelection.forEach(shape => {
        shape.points.forEach(point => {
            point[0] += translationX - tempTranslationX;
        });
    });
}

// Function to translate points in pointSelection
function translateXPoints(pointSelection, indexPoint, translationX) {
    pointSelection.forEach((point, index) => {
        let shape = point;
        if (shape.constructor.name == "Square") {
            translateXSquare(shape, indexPoint[index], translationX);
        } else if (shape.constructor.name == "Rectangle") {
            translateXRectangle(shape, indexPoint[index], translationX);
        } else {
            shape.points[indexPoint[index] - 1][0] += translationX - tempTranslationX;
        }
    });
}

// Function to translate a square
function translateXSquare(square, pointIndex, translationX) {
    let squarePointIndex = pointIndex - 1;
    let width = translationX - tempTranslationX;

    if (squarePointIndex == 0) {
        square.points[squarePointIndex][0] += width;
        square.points[squarePointIndex][1] -= width;

        square.points[squarePointIndex + 1][1] -= width;
        square.points[squarePointIndex + 2][0] += width;
    } else if (squarePointIndex == 1) {
        square.points[squarePointIndex][0] += width;
        square.points[squarePointIndex][1] += width;

        square.points[squarePointIndex + 2][0] += width;
        square.points[squarePointIndex - 1][1] += width;
    } else if (squarePointIndex == 2) {
        square.points[squarePointIndex][0] += width;
        square.points[squarePointIndex][1] += width;

        square.points[squarePointIndex - 2][0] += width;
        square.points[squarePointIndex + 1][1] += width;
    } else {
        square.points[squarePointIndex][0] += width;
        square.points[squarePointIndex][1] -= width;

        square.points[squarePointIndex - 1][1] -= width;
        square.points[squarePointIndex - 2][0] += width;
    }
}

// Function to translate a rectangle
function translateXRectangle(rectangle, pointIndex, translationX) {
    let squarePointIndex = pointIndex - 1;
    let width = translationX - tempTranslationX;
    let ratio = (rectangle.points[0][0] - rectangle.points[1][0]) / (rectangle.points[0][1] - rectangle.points[2][1]);
    if (ratio < 0) {
        ratio *= -1;
    }
    let height = width / ratio;

    if (squarePointIndex == 0) {
        rectangle.points[squarePointIndex][0] += width;
        rectangle.points[squarePointIndex][1] -= height;

        rectangle.points[squarePointIndex + 1][1] -= height;
        rectangle.points[squarePointIndex + 2][0] += width;
    } else if (squarePointIndex == 1) {
        rectangle.points[squarePointIndex][0] += width;
        rectangle.points[squarePointIndex][1] += height;

        rectangle.points[squarePointIndex + 2][0] += width;
        rectangle.points[squarePointIndex - 1][1] += height;
    } else if (squarePointIndex == 2) {
        rectangle.points[squarePointIndex][0] += width;
        rectangle.points[squarePointIndex][1] += height;

        rectangle.points[squarePointIndex - 2][0] += width;
        rectangle.points[squarePointIndex + 1][1] += height;
    } else {
        rectangle.points[squarePointIndex][0] += width;
        rectangle.points[squarePointIndex][1] -= height;

        rectangle.points[squarePointIndex - 1][1] -= height;
        rectangle.points[squarePointIndex - 2][0] += width;
    }
}


function translateYObject(shapeSelection, pointSelection, indexPoint, value) {
    console.log(value);
    let translationY = value;

    console.log("shapeSelection", shapeSelection);
    
    // Translate shapes in shapeSelection
    translateYShapes(shapeSelection, translationY);

    // Translate points in pointSelection
    translateYPoints(pointSelection, indexPoint, translationY);

    tempTranslationY = translationY;
}

// Function to translate shapes in shapeSelection
function translateYShapes(shapeSelection, translationY) {
    shapeSelection.forEach(shape => {
        shape.points.forEach(point => {
            point[1] += translationY - tempTranslationY;
        });
    });
}

// Function to translate points in pointSelection
function translateYPoints(pointSelection, indexPoint, translationY) {
    pointSelection.forEach((point, index) => {
        let shape = point;
        if (shape.constructor.name == "Square") {
            translateYSquare(shape, indexPoint[index], translationY);
        } else if (shape.constructor.name == "Rectangle") {
            translateYRectangle(shape, indexPoint[index], translationY);
        } else {
            shape.points[indexPoint[index] - 1][1] += translationY - tempTranslationY;
        }
    });
}

// Function to translate a square
function translateYSquare(square, pointIndex, translationY) {
    let squarePointIndex = pointIndex - 1;
    let height = translationY - tempTranslationY;

    if (squarePointIndex == 0) {
        square.points[squarePointIndex][0] += height;
        square.points[squarePointIndex][1] -= height;

        square.points[squarePointIndex + 1][1] -= height;
        square.points[squarePointIndex + 2][0] += height;
    } else if (squarePointIndex == 1) {
        square.points[squarePointIndex][0] -= height;
        square.points[squarePointIndex][1] -= height;

        square.points[squarePointIndex + 2][0] -= height;
        square.points[squarePointIndex - 1][1] -= height;
    } else if (squarePointIndex == 2) {
        square.points[squarePointIndex][0] -= height;
        square.points[squarePointIndex][1] -= height;

        square.points[squarePointIndex - 2][0] -= height;
        square.points[squarePointIndex + 1][1] -= height;
    } else {
        square.points[squarePointIndex][0] += height;
        square.points[squarePointIndex][1] -= height;

        square.points[squarePointIndex - 1][1] -= height;
        square.points[squarePointIndex - 2][0] += height;
    }
}

// Function to translate a rectangle
function translateYRectangle(rectangle, pointIndex, translationY) {
    let squarePointIndex = pointIndex - 1;
    let height = translationY - tempTranslationY;
    let ratio = (rectangle.points[0][0] - rectangle.points[1][0]) / (rectangle.points[0][1] - rectangle.points[2][1]);
    if (ratio < 0) {
        ratio *= -1;
    }
    let width = height * ratio;

    if (squarePointIndex == 0) {
        rectangle.points[squarePointIndex][0] += width;
        rectangle.points[squarePointIndex][1] -= height;

        rectangle.points[squarePointIndex + 1][1] -= height;
        rectangle.points[squarePointIndex + 2][0] += width;
    } else if (squarePointIndex == 1) {
        rectangle.points[squarePointIndex][0] -= width;
        rectangle.points[squarePointIndex][1] -= height;

        rectangle.points[squarePointIndex + 2][0] -= width;
        rectangle.points[squarePointIndex - 1][1] -= height;
    } else if (squarePointIndex == 2) {
        rectangle.points[squarePointIndex][0] -= width;
        rectangle.points[squarePointIndex][1] -= height;

        rectangle.points[squarePointIndex - 2][0] -= width;
        rectangle.points[squarePointIndex + 1][1] -= height;
    } else {
        rectangle.points[squarePointIndex][0] += width;
        rectangle.points[squarePointIndex][1] -= height;

        rectangle.points[squarePointIndex - 1][1] -= height;
        rectangle.points[squarePointIndex - 2][0] += width;
    }
}


function deleteVertexPolygon(shapeSelection, pointSelection, indexPoint) {
    
    pointSelection.forEach((point, index) => {
        let shape = point
       if (shape.constructor.name == "Polygon") {
            let polygonPointIndex = indexPoint[index] - 1;
            shape.points.splice(polygonPointIndex, 1);
        }
    });

}


// function addVertexPolygon(shapeSelection, pointSelection, indexPoint) {

// }




