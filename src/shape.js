class Shape {
  constructor() {
    this.points = [];
    this.colors = [];
    this.centroid = [0, 0];
  }

  onRenderMove(x, y) {
    throw new Error("Must be implemented");
  }

  render() {
    throw new Error("Must be implemented");
  }

  setCentroid() {
    this.centroid = centroid(this.points);
  }
}

class Line extends Shape {
  constructor(x, y) {
    super();
    let { r, g, b } = getRGB(rgb);
    for (let i = 0; i < 2; i++) {
      this.colors.push([r, g, b, 1]);
      this.points.push(coor(canvas, x, y));
    }
  }

  render(program) {
    this.setCentroid();
    renderColor(program, flatten(this.colors), 4);
    renderVertex(program, flatten(this.points), 2);
    for (let i = 0; i < this.points.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  }

  onRenderMove(x, y) {
    let len = this.points.length;
    this.points[len - 1][0] = x;
    this.points[len - 1][1] = y;
  }
}

class Square extends Shape {  
  constructor(x, y) {
    super();
    // Predefined size and color
    let size = 3;
    let { r, g, b } = getRGB(rgb); // Red color
    // Assuming square is centered at (x, y)
    let topLeft = coor(canvas, x - size, y + size);
    let topRight = coor(canvas, x + size, y + size);
    let bottomLeft = coor(canvas, x - size, y - size);
    let bottomRight = coor(canvas, x + size, y - size);

    this.colors = [
      [r, g, b, 1], // Top left
      [r, g, b, 1], // Top right
      [r, g, b, 1], // Bottom left
      [r, g, b, 1]  // Bottom right
    ];

    this.points = [topLeft, topRight, bottomLeft, bottomRight];
  }

  render(program) {
    this.setCentroid();
    renderColor(program, flatten(this.colors), 4);
    renderVertex(program, flatten(this.points), 2);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  onRenderMove(x, y) {
    // Calculate the distance moved from the top-left corner
    let len = this.points.length;
    //calculate distance x from bottom left[0]
    let distanceX = x - this.points[0][0];
    this.points[len-1][0] = x;
    this.points[len-1][1] = this.points[1][1] -distanceX;
    this.points[len-2][1] = this.points[0][1] -distanceX;
    this.points[len-3][0] = this.points[0][0] +distanceX;
    
    
    // Calculate the new centroid
    this.setCentroid();
}

}

class Rectangle extends Shape {
  constructor(x, y) {
    super();
    let size = 3;
    let { r, g, b } = getRGB(rgb);
    let topLeft = coor(canvas, x - size, y + size);
    let topRight = coor(canvas, x + size, y + size);
    let bottomLeft = coor(canvas, x - size, y - size);
    let bottomRight = coor(canvas, x + size, y - size);

    this.colors = [
      [r, g, b, 1], // Top left
      [r, g, b, 1], // Top right
      [r, g, b, 1], // Bottom left
      [r, g, b, 1]  // Bottom right
    ];

    this.points = [topLeft, topRight, bottomLeft, bottomRight];
  }

  render(program) {
    this.setCentroid();
    renderColor(program, flatten(this.colors), 4);
    renderVertex(program, flatten(this.points), 2);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  onRenderMove(x, y) {
    let len = this.points.length;
    this.points[len - 1][0] = x;
    this.points[len - 1][1] = y;
    this.points[len - 2][1] = y;
    this.points[len - 3][0] = x;
  }
}

class Polygon extends Shape {
  constructor(x, y) {
    super();
    let { r, g, b } = getRGB(rgb);
    for (let i = 0; i < 2; i++) {
      this.colors.push([r, g, b, 1]);
      this.points.push(coor(canvas, x, y));
    }
  }

  render(program) {
    this.setCentroid();
    renderColor(program, flatten(this.colors), 4);
    renderVertex(program, flatten(this.points), 2);
    if (this.points.length == 2) {
      for (let i = 0; i < this.points.length; i += 2) {
        gl.drawArrays(gl.LINES, i, 2);
      }
    }
    else {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length);
    }
  }

  onRenderMove(x, y) {
    let len = this.points.length;
    this.points[len - 1][0] = x;
    this.points[len - 1][1] = y;
  }

  vertexAdded(x, y){
    if (this.points.length > 2) {
      this.points = convexHull(this.points);
    }
    this.points.push(coor(canvas, x, y))
    let { r, g, b } = getRGB(rgb);
    this.colors.push([r, g, b, 1]);
  }

  vertexRemoved(){
    this.points.pop();
    this.colors.pop();
  }

}





