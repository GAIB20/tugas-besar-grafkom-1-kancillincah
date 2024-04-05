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
    shapeSelection.forEach(shape => {
        shape.points.forEach(point => {
            point[0] += translationX - tempTranslationX;
        });
    });

    pointSelection.forEach((point, index) => {
        let shape = point
        if (shape.constructor.name == "Square") {
            let squarePointIndex = indexPoint[index] - 1;
            if (squarePointIndex == 0) {
                shape.points[squarePointIndex][0] += translationX - tempTranslationX;
                shape.points[squarePointIndex][1] -= translationX - tempTranslationX;

                shape.points[squarePointIndex + 1][1] -= translationX - tempTranslationX;
                shape.points[squarePointIndex + 2][0] += translationX - tempTranslationX;
            } else if (squarePointIndex == 1) {
                shape.points[squarePointIndex][0] += translationX - tempTranslationX;
                shape.points[squarePointIndex][1] += translationX - tempTranslationX;

                shape.points[squarePointIndex + 2][0] += translationX - tempTranslationX;
                shape.points[squarePointIndex - 1][1] += translationX - tempTranslationX;
            } else if (squarePointIndex == 2) {
                shape.points[squarePointIndex][0] += translationX - tempTranslationX;
                shape.points[squarePointIndex][1] += translationX - tempTranslationX;

                shape.points[squarePointIndex - 2][0] += translationX - tempTranslationX;
                shape.points[squarePointIndex + 1][1] += translationX - tempTranslationX;
            } else {
                shape.points[squarePointIndex][0] += translationX - tempTranslationX;
                shape.points[squarePointIndex][1] -= translationX - tempTranslationX;

                shape.points[squarePointIndex - 1][1] -= translationX - tempTranslationX;
                shape.points[squarePointIndex - 2][0] += translationX - tempTranslationX;
            }
            
        } else if (shape.constructor.name == "Rectangle") {
            let ratio = 
                (shape.points[0][0] - shape.points[1][0]) /
                (shape.points[0][1] - shape.points[2][1]);
            if (ratio < 0) {
                ratio *= -1;
            }
            let width = translationX - tempTranslationX;
            let height = width / ratio;

            let squarePointIndex = indexPoint[index] - 1;
            if (squarePointIndex == 0) {
                shape.points[squarePointIndex][0] += width;
                shape.points[squarePointIndex][1] -= height;

                shape.points[squarePointIndex + 1][1] -= height;
                shape.points[squarePointIndex + 2][0] += width;
            } else if (squarePointIndex == 1) {
                shape.points[squarePointIndex][0] += width;
                shape.points[squarePointIndex][1] += height;

                shape.points[squarePointIndex + 2][0] += width;
                shape.points[squarePointIndex - 1][1] += height;
            } else if (squarePointIndex == 2) {
                shape.points[squarePointIndex][0] += width;
                shape.points[squarePointIndex][1] += height;

                shape.points[squarePointIndex - 2][0] += width;
                shape.points[squarePointIndex + 1][1] += height;
            } else {
                shape.points[squarePointIndex][0] += width;
                shape.points[squarePointIndex][1] -= height;

                shape.points[squarePointIndex - 1][1] -= height;
                shape.points[squarePointIndex - 2][0] += width;
            }
        } else {
            shape.points[indexPoint[index] - 1][0] += translationX - tempTranslationX;
        }
    });
    tempTranslationX = translationX;       
}

function translateYObject(shapeSelection, pointSelection, indexPoint, value) {
    console.log(value);
    let translationY = value;

    console.log("shapeSelection", shapeSelection);
    shapeSelection.forEach(shape => {
        shape.points.forEach(point => {
            point[1] += translationY - tempTranslationY;
        });
    });

    pointSelection.forEach((point, index) => {
        let shape = point
        if (shape.constructor.name == "Square") {
            let squarePointIndex = indexPoint[index] - 1;
            if (squarePointIndex == 0) {
                shape.points[squarePointIndex][0] += translationY - tempTranslationY;
                shape.points[squarePointIndex][1] -= translationY - tempTranslationY;

                shape.points[squarePointIndex + 1][1] -= translationY - tempTranslationY;
                shape.points[squarePointIndex + 2][0] += translationY - tempTranslationY;
            } else if (squarePointIndex == 1) {
                shape.points[squarePointIndex][0] -= translationY - tempTranslationY;
                shape.points[squarePointIndex][1] -= translationY - tempTranslationY;

                shape.points[squarePointIndex + 2][0] -= translationY - tempTranslationY;
                shape.points[squarePointIndex - 1][1] -= translationY - tempTranslationY;
            } else if (squarePointIndex == 2) {
                shape.points[squarePointIndex][0] -= translationY - tempTranslationY;
                shape.points[squarePointIndex][1] -= translationY - tempTranslationY;

                shape.points[squarePointIndex - 2][0] -= translationY - tempTranslationY;
                shape.points[squarePointIndex + 1][1] -= translationY - tempTranslationY;
            } else {
                shape.points[squarePointIndex][0] += translationY - tempTranslationY;
                shape.points[squarePointIndex][1] -= translationY - tempTranslationY;

                shape.points[squarePointIndex - 1][1] -= translationY - tempTranslationY;
                shape.points[squarePointIndex - 2][0] += translationY - tempTranslationY;
            }
            
        } else if (shape.constructor.name == "Rectangle") {
            let ratio = 
                (shape.points[0][0] - shape.points[1][0]) /
                (shape.points[0][1] - shape.points[2][1]);
            if (ratio < 0) {
                ratio *= -1;
            }
            let width = translationY - tempTranslationY;
            let height = width / ratio;

            let squarePointIndex = indexPoint[index] - 1;
            if (squarePointIndex == 0) {
                shape.points[squarePointIndex][0] += width;
                shape.points[squarePointIndex][1] -= height;

                shape.points[squarePointIndex + 1][1] -= height;
                shape.points[squarePointIndex + 2][0] += width;
            } else if (squarePointIndex == 1) {
                shape.points[squarePointIndex][0] -= width;
                shape.points[squarePointIndex][1] -= height;

                shape.points[squarePointIndex + 2][0] -= width;
                shape.points[squarePointIndex - 1][1] -= height;
            } else if (squarePointIndex == 2) {
                shape.points[squarePointIndex][0] -= width;
                shape.points[squarePointIndex][1] -= height;

                shape.points[squarePointIndex - 2][0] -= width;
                shape.points[squarePointIndex + 1][1] -= height;
            } else {
                shape.points[squarePointIndex][0] += width;
                shape.points[squarePointIndex][1] -= height;

                shape.points[squarePointIndex - 1][1] -= height;
                shape.points[squarePointIndex - 2][0] += width;
            }
        } else {
            shape.points[indexPoint[index] - 1][1] += translationY - tempTranslationY;
        }
    });
   tempTranslationY = translationY;
}




