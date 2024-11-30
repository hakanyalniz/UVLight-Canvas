const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const radius = 200; // Radius of the blurred reveal area
const trail = []; // Will contain positions and fade out effects

// Mouse position
let mouseX;
let mouseY;

// Draw the mask and update the trail
function drawMask() {
  // Clear the canvas for next update
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Cover the image with dark rectangle
  ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "destination-out";

  // If mouse position is not available then do not add anything to trail
  if (typeof mouseX === "number") {
    // Add current mouse position to the trail at each frame
    trail.push({ x: mouseX, y: mouseY, opacity: 1 });

    // Draw all points in the trail with blurred edges
    trail.forEach((point) => {
      const gradient = ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        radius
      );

      gradient.addColorStop(0, `rgba(0, 0, 0, ${point.opacity})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.globalCompositeOperation = "source-over";

  // Fade out old trail points
  for (let i = 0; i < trail.length; i++) {
    trail[i].opacity -= 0.006;
    if (trail[i].opacity <= 0) {
      trail.splice(i, 1); // Remove faded points
      i--;
    }
  }

  requestAnimationFrame(drawMask);
}

// Update mouse position on move
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Start the animation loop
drawMask();

// Update canvas size on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
