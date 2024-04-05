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