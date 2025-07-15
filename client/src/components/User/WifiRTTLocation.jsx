let currentX = 40;
let currentY = 8;
const xLimit = 45;
const yLimit = 8;
let directionX = 1;
let directionY = 0;

export function getWifiRTTLocation() {
  return new Promise((resolve) => {
    // Simulate async delay
    setTimeout(() => {
      // Update position
      currentX += directionX;
      currentY += directionY;

      // Bounce logic
      if (currentX >= xLimit || currentX <= 0) directionX *= -1;
      if (currentY >= yLimit || currentY <= 0) directionY *= -1;

      resolve({ x: currentX, y: currentY });
    }, 500);
  });
}
