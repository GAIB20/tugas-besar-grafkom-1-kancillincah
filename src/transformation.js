let tempRotation = 0;

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

function colorObject(shapeSelection, pointSelection, indexPoint, value) {
    let color = getRGB(value);

    shapeSelection.forEach(shape => {
        shape.colors.forEach(colors => {
            colors[0] = color.r;
            colors[1] = color.g;
            colors[2] = color.b;
        });
    });

    pointSelection.forEach((point, index) => {
        let i = indexPoint[index] - 1;
        point.colors[i][0] = color.r;
        point.colors[i][1] = color.g;
        point.colors[i][2] = color.b;
        console.log(point.colors)
    });
}