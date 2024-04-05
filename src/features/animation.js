function animationObject(shapeSelection, pointSelection, indexPoint) {
    let startTime;
    let animationId;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        const rotationSpeed = 0.1;
        shapeSelection.forEach(shape => {
            const center = centroid(shape.points);
            shape.points.forEach(point => {
                const x = point[0] - center[0];
                const y = point[1] - center[1];
                const angle = Math.atan2(y, x);
                const distance = Math.sqrt(x * x + y * y);
                const newAngle = angle + rotationSpeed * elapsed;
                point[0] = center[0] + distance * Math.cos(newAngle);
                point[1] = center[1] + distance * Math.sin(newAngle);
            });
        });

        // Example animation: pulsating colors for points
        const colorSpeed = 0.3;
        pointSelection.forEach((point, index) => {
            const i = indexPoint[index] - 1;
            const color = point.colors[i];
            color[0] = (Math.sin(colorSpeed * elapsed) + 1) / 2; // Red component
            color[1] = (Math.sin(colorSpeed * elapsed + Math.PI / 3) + 1) / 2; // Green component
            color[2] = (Math.sin(colorSpeed * elapsed + 2 * Math.PI / 3) + 1) / 2; // Blue component
        });

        // Repeat the animation
        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        stopAnimation(); // Stop any existing animation before starting a new one
        animationId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        cancelAnimationFrame(animationId);
    }
    
    startAnimation();
    return { stopAnimation };
}
