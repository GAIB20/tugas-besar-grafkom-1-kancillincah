function uncheckObject() {
    let checkbox = document.querySelectorAll("input[type=checkbox]");
    for (let i = 0; i < checkbox.length; i++) {
      checkbox[i].checked = false;
    }
}

function editObject() {
    console.log("masuk editObject");

    let checkbox = document.querySelectorAll("input[type=checkbox]")
    checked = [];
    modelList = [];
    printList = [];
    pointIndex = [];
    for (let i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
          checked.push(checkbox[i].value);
        }
    }
    let list = filterSelectedObject(checked);
    modelList = list[0];
    pointList = list[1];
    pointIndex = list[2];
    console.log(pointList);
    console.log(pointIndex);

    //horizontal translation
    const xSlider = document.getElementById("x-translation");
    tempX = 0;
    xSlider.addEventListener("input", function () {
        let xTranslation = xSlider.value;
        for (let p = 0; p < modelList.length; p++) {
            let model = modelList[p];
                for (let i = 0; i < model.points.length; i++) {
                    model.points[i][0] += xTranslation - tempX;
                }
            }

        for (let p = 0; p < pointList.length; p++) {
            let model = pointList[p];
            if (model.constructor.name == "Square") {
                let squarePointIndex = pointIndex[p] - 1;
                if (squarePointIndex == 0) {
                    model.points[squarePointIndex][0] += xTranslation - tempX;
                    model.points[squarePointIndex][1] -= xTranslation - tempX;

                    model.points[squarePointIndex + 1][1] -= xTranslation - tempX;
                    model.points[squarePointIndex + 2][0] += xTranslation - tempX;
                } else if (squarePointIndex == 1) {
                    model.points[squarePointIndex][0] += xTranslation - tempX;
                    model.points[squarePointIndex][1] += xTranslation - tempX;

                    model.points[squarePointIndex + 2][0] += xTranslation - tempX;
                    model.points[squarePointIndex - 1][1] += xTranslation - tempX;
                } else if (squarePointIndex == 2) {
                    model.points[squarePointIndex][0] += xTranslation - tempX;
                    model.points[squarePointIndex][1] += xTranslation - tempX;

                    model.points[squarePointIndex - 2][0] += xTranslation - tempX;
                    model.points[squarePointIndex + 1][1] += xTranslation - tempX;
                } else {
                //squarePointIndex == 3
                    model.points[squarePointIndex][0] += xTranslation - tempX;
                    model.points[squarePointIndex][1] -= xTranslation - tempX;

                    model.points[squarePointIndex - 1][1] -= xTranslation - tempX;
                    model.points[squarePointIndex - 2][0] += xTranslation - tempX;
                }
            } else if (model.constructor.name == "Rectangle") {
                let widthHeightRatio =
                    (model.points[0][0] - model.points[1][0]) /
                    (model.points[0][1] - model.points[2][1]);
                console.log(model.points[0][0] - model.points[1][0]);
                console.log(model.points[0][1] - model.points[2][1]);
                console.log(widthHeightRatio);
                if (widthHeightRatio < 0) {
                    widthHeightRatio *= -1;
                }
                let widthTranslation = xTranslation - tempX;
                let heightTranslation = widthTranslation / widthHeightRatio;

                let squarePointIndex = pointIndex[p] - 1;
                if (squarePointIndex == 0) {
                    model.points[squarePointIndex][0] += widthTranslation;
                    model.points[squarePointIndex][1] -= heightTranslation;

                    model.points[squarePointIndex + 1][1] -= heightTranslation;
                    model.points[squarePointIndex + 2][0] += widthTranslation;
                } else if (squarePointIndex == 1) {
                    model.points[squarePointIndex][0] += widthTranslation;
                    model.points[squarePointIndex][1] += heightTranslation;

                    model.points[squarePointIndex + 2][0] += widthTranslation;
                    model.points[squarePointIndex - 1][1] += heightTranslation;
                } else if (squarePointIndex == 2) {
                    model.points[squarePointIndex][0] += widthTranslation;
                    model.points[squarePointIndex][1] += heightTranslation;

                    model.points[squarePointIndex - 2][0] += widthTranslation;
                    model.points[squarePointIndex + 1][1] += heightTranslation;
                } else {
                //squarePointIndex == 3
                    model.points[squarePointIndex][0] += widthTranslation;
                    model.points[squarePointIndex][1] -= heightTranslation;

                    model.points[squarePointIndex - 1][1] -= heightTranslation;
                    model.points[squarePointIndex - 2][0] += widthTranslation;
                }
            } else {
                //line and polygon
                model.points[pointIndex[p] - 1][0] += xTranslation - tempX;
            }
        }
        tempX = xTranslation;
    });

    const ySlider = document.getElementById("y-translation");
    tempY = 0;

    ySlider.addEventListener("input", function () {
        let yTranslation = ySlider.value;
        for (let p = 0; p < modelList.length; p++) {
            let model = modelList[p];
            for (let i = 0; i < model.points.length; i++) {
                model.points[i][1] += yTranslation - tempY;
            }
        }

        for (let p = 0; p < pointList.length; p++) {
            let model = pointList[p];
            if (model.constructor.name == "Square") {
                let squarePointIndex = pointIndex[p] - 1;
                if (squarePointIndex == 0) {
                    model.points[squarePointIndex][0] += yTranslation - tempY;
                    model.points[squarePointIndex][1] -= yTranslation - tempY;

                    model.points[squarePointIndex + 1][1] -= yTranslation - tempY;
                    model.points[squarePointIndex + 2][0] += yTranslation - tempY;
                } else if (squarePointIndex == 1) {
                    model.points[squarePointIndex][0] -= yTranslation - tempY;
                    model.points[squarePointIndex][1] -= yTranslation - tempY;

                    model.points[squarePointIndex + 2][0] -= yTranslation - tempY;
                    model.points[squarePointIndex - 1][1] -= yTranslation - tempY;
                } else if (squarePointIndex == 2) {
                    model.points[squarePointIndex][0] -= yTranslation - tempY;
                    model.points[squarePointIndex][1] -= yTranslation - tempY;

                    model.points[squarePointIndex - 2][0] -= yTranslation - tempY;
                    model.points[squarePointIndex + 1][1] -= yTranslation - tempY;
                } else {
                //squarePointIndex == 3
                    model.points[squarePointIndex][0] += yTranslation - tempY;
                    model.points[squarePointIndex][1] -= yTranslation - tempY;

                    model.points[squarePointIndex - 1][1] -= yTranslation - tempY;
                    model.points[squarePointIndex - 2][0] += yTranslation - tempY;
                }
            } else if (model.constructor.name == "Rectangle") {
                let widthHeightRatio =
                    (model.points[0][0] - model.points[1][0]) /
                    (model.points[0][1] - model.points[2][1]);
                if (widthHeightRatio < 0) {
                    widthHeightRatio *= -1;
                }
                let widthTranslation = yTranslation - tempY;
                let heightTranslation = widthTranslation / widthHeightRatio;

                let squarePointIndex = pointIndex[p] - 1;
                if (squarePointIndex == 0) {
                    model.points[squarePointIndex][0] += widthTranslation;
                    model.points[squarePointIndex][1] -= heightTranslation;

                    model.points[squarePointIndex + 1][1] -= heightTranslation;
                    model.points[squarePointIndex + 2][0] += widthTranslation;
                } else if (squarePointIndex == 1) {
                    model.points[squarePointIndex][0] -= widthTranslation;
                    model.points[squarePointIndex][1] -= heightTranslation;

                    model.points[squarePointIndex + 2][0] -= widthTranslation;
                    model.points[squarePointIndex - 1][1] -= heightTranslation;
                } else if (squarePointIndex == 2) {
                    model.points[squarePointIndex][0] -= widthTranslation;
                    model.points[squarePointIndex][1] -= heightTranslation;

                    model.points[squarePointIndex - 2][0] -= widthTranslation;
                    model.points[squarePointIndex + 1][1] -= heightTranslation;
                } else {
                //squarePointIndex == 3
                    model.points[squarePointIndex][0] += widthTranslation;
                    model.points[squarePointIndex][1] -= heightTranslation;

                    model.points[squarePointIndex - 1][1] -= heightTranslation;
                    model.points[squarePointIndex - 2][0] += widthTranslation;
                }
            } else {
                //line and polygon
                model.points[pointIndex[p] - 1][1] += yTranslation - tempY;
            }
        }

        tempY = yTranslation;
    });

    const scaleSlider = document.getElementById("dilatation");
    tempScale = 1;

    scaleSlider.addEventListener("input", function () {
        let scale = scaleSlider.value;
        for (let p = 0; p < modelList.length; p++) {
            let model = modelList[p];
            console.log("model", model);
            console.log("model.positions", model.points);
            let center = centroid(model.points);
            for (let i = 0; i < model.points.length; i++) {
            model.points[i][0] =
                center[0] + ((model.points[i][0] - center[0]) * scale) / tempScale;
            model.points[i][1] =
                center[1] + ((model.points[i][1] - center[1]) * scale) / tempScale;
            }
        }
        tempScale = scale;
    });
    // for (let i = 0; i < checkbox.length; i++) {
    //   checkbox[i].addEventListener("change", function () {
    //     if (this.checked) {
    //       let id = this.id;
    //       let object = objects[id];
    //       object.isEditing = true;
    //       object.edit();
    //     } else {
    //       let id = this.id;
    //       let object = objects[id];
    //       object.isEditing = false;
    //     }
    //   });
    // }
}

function filterSelectedObject(array) {
    console.log("masuk filterSelectedObject")
    let selectedModel = [];
    let selectedPoint = [];
    let modelInserted = [];
    let pointIndex = [];
  
    for (let i = 0; i < array.length; i++) {
        console.log("model", array[i]);
        let m = array[i][0];
        if (array[i].length < 5) {
            if (m == "l") {
                selectedModel.push(shape.line[array[i][1] - 1]);
                console.log(shape.line[array[i][1] - 1]);
                modelInserted.push(array[i]);
            } else if (m == "s") {
                selectedModel.push(shape.square[array[i][1] - 1]);
                modelInserted.push(array[i]);
            } else if (m == "r") {
                selectedModel.push(shape.rectangle[array[i][1] - 1]);
                modelInserted.push(array[i]);
            } else if (m == "p") {
                selectedModel.push(shape.polygon[array[i][1] - 1]);
                modelInserted.push(array[i]);
            }
        } else {
            let point = array[i].split("point");
            console.log(point);
            if (!modelInserted.includes(point[0])) {
                if (m == "l") {
                    selectedPoint.push(models.line[array[i][1] - 1]);
                    modelInserted.push(array[i]);
                    pointIndex.push(point[1]);
                } else if (m == "s") {
                    selectedPoint.push(models.square[array[i][1] - 1]);
                    modelInserted.push(array[i]);
                    pointIndex.push(point[1]);
                } else if (m == "r") {
                    selectedPoint.push(models.rectangle[array[i][1] - 1]);
                    modelInserted.push(array[i]);
                    pointIndex.push(point[1]);
                } else if (m == "p") {
                    selectedPoint.push(models.polygon[array[i][1] - 1]);
                    modelInserted.push(array[i]);
                    pointIndex.push(point[1]);
                }
            }
        }
    }
    return [selectedModel, selectedPoint, pointIndex];
  }

function printModels(model, obj) {
    console.log(model[0]);
    objCount = obj.length;
    console.log("objCount", objCount);
    pointCount = obj[objCount - 1].points.length;
    console.log(obj[objCount - 1].positions);
    let list = document.getElementById("list");
    object = document.createElement("div");
    object.innerHTML = `
    <input type="checkbox" id="${model[0]}${objCount}" name="${model[0]}${objCount}" value="${model[0]}${objCount}" >
    <label for="${model[0]}${objCount}">${model}${objCount}</label><br>
     `;
    list.appendChild(object);
  
    for (let i = 1; i <= pointCount; i++) {
      let point = document.createElement("li");
      point.innerHTML = `
      <input type="checkbox" id="${model[0]}${objCount}point${i}" name="${model[0]}${objCount}point" value="${model[0]}${objCount}point${i}">
      <label for="${model[0]}${objCount}point${i}">point${i}</label><br>
      `;
  
      object.appendChild(point);
    }

    let shapeSelection = document.getElementById(`${model[0]}${obj.length}`);
    let objectCount = obj.length;
    console.log("shapeSelection", shapeSelection);
    shapeSelection.addEventListener("change", function () {
        if (shapeSelection.checked) {
            console.log("checked");
            document
                .querySelectorAll(`input[name="${model[0]}${objectCount}point"]`)
                .forEach((item) => {
                item.checked = true;
            });
        } else {
            document
                .querySelectorAll(`input[name="${model[0]}${objectCount}point"]`)
                .forEach((item) => {
                item.checked = false;
            });
        }
    });
}