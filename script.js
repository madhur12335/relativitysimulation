const canvas = document.getElementById('relativityCanvas');
  const ctx = canvas.getContext('2d');
  const entityCanvas = document.getElementById('entityCanvas');
  const entityCtx = entityCanvas.getContext('2d');
  const speedControl = document.getElementById('speedControl');
  const infoDiv = document.getElementById('info');
  const speedValueDisplay = document.getElementById('speedValue');
  const gammaValueDisplay = document.getElementById('gammaValue');
  const perspectiveInfoDisplay = document.getElementById('perspectiveInfo');
  const explanationDiv = document.getElementById('explanation');
  const speedOfLightOverlay = document.getElementById('speedOfLightOverlay');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  entityCanvas.width = window.innerWidth;
  entityCanvas.height = window.innerHeight;

  // **--- Troubleshooting Canvas Dimensions Output ---**
  console.log("Canvas Width:", canvas.width, "Canvas Height:", canvas.height);
  console.log("Entity Canvas Width:", entityCanvas.width, "Entity Canvas Height:", entityCanvas.height);
  // **---------------------------------------------**


  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  let speed = 0; // Speed as a fraction of c
  let beta = 0;
  let gamma = 1;
  let motionDirection = 0; // 0 for right, Math.PI for left, etc.

  // **Planet Data:** Array of planet objects
  const planets = [
    { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 30, color: '#4a8fe7' }, // Blue planet
    { x: canvas.width * 0.7, y: canvas.height * 0.7, radius: 50, color: '#f7b267' }, // Orange planet
    { x: canvas.width * 0.5, y: canvas.height * 0.2, radius: 20, color: '#8de74a' }, // Green planet
    { x: canvas.width * 0.8, y: canvas.height * 0.4, radius: 40, color: '#e74a8f' }, // Pink planet
  ];


  const animationSpeedMultiplier = 50;
  let planetMotionOffset = 0; // Offset for planet motion


  function updateRelativisticValues() {
    speed = parseFloat(speedControl.value); // Get speed from slider
    beta = speed;
    gamma = 1 / Math.sqrt(1 - beta * beta);
    speedValueDisplay.textContent = speed.toFixed(2) + 'c';
    gammaValueDisplay.textContent = gamma.toFixed(2);

     if (speed > 0) {
      perspectiveInfoDisplay.textContent = `Observer moving right at ${speed.toFixed(2)}c`;
    } else if (speed < 0) {
      perspectiveInfoDisplay.textContent = `Observer moving left at ${Math.abs(speed).toFixed(2)}c`;
    } else {
      perspectiveInfoDisplay.textContent = 'Observer at rest';
    }

    updateExplanation(); // Update explanation text
  }


  function drawBackground() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // **--- Troubleshooting Red Square ---**
    ctx.fillStyle = 'red';  // Set fill color to red
    ctx.fillRect(50, 50, 100, 100); // Draw a red square
    // **--------------------------------**
  }

  function drawStars(numStars = 150) {
    ctx.fillStyle = '#ddd'; // Lighter star color
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  function drawGrid(spacing = 70, motionLinesSpacing = 30) {
    // **--- Changed grid color to green ---**
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)'; // Green grid lines, semi-transparent
    ctx.lineWidth = 0.4;

    // Motion lines
    ctx.strokeStyle = 'rgba(0, 200, 0, 0.5)'; // Slightly darker green for motion lines
    for (let i = -canvas.width; i < canvas.width; i += motionLinesSpacing) {
      ctx.beginPath();
      ctx.moveTo(centerX + i, 0);
      ctx.lineTo(centerX + i - speed * 100 * gamma, canvas.height);
      ctx.stroke();
    }

    // **--- Changed grid color to green ---**
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)'; // Reset to green grid color

    // Vertical lines
    for (let x = -centerX; x < centerX; x += spacing) {
      const relativisticX = x * gamma;
      ctx.beginPath();
      ctx.moveTo(centerX + relativisticX, 0);
      ctx.lineTo(centerX + relativisticX, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = -centerY; y < centerY; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, centerY + y);
      ctx.lineTo(canvas.width, centerY + y);
      ctx.stroke();
    }
  }

  // **NEW: drawPlanets function**
  function drawPlanets() {
    entityCtx.clearRect(0, 0, entityCanvas.width, entityCanvas.height); // Clear entity canvas

    planetMotionOffset += speed * animationSpeedMultiplier * 0.05; // Planets move slower, adjust 0.05 for speed

    planets.forEach(planet => {
      entityCtx.fillStyle = planet.color;
      entityCtx.beginPath();
      // **Animated Planet X Position**: planets move horizontally with offset
      const animatedX = planet.x + planetMotionOffset;
      entityCtx.arc(animatedX % canvas.width, planet.y, planet.radius, 0, Math.PI * 2); // Use modulo (%) for looping
      entityCtx.fill();
    });
  }


  function drawSpeedOfLightEffect() {
    if (Math.abs(speed) > 0.95) {
      speedOfLightOverlay.classList.add('speedOfLightActive');
    } else {
      speedOfLightOverlay.classList.remove('speedOfLightActive');
    }
  }


  function draw() {
    updateRelativisticValues();
    drawBackground();
    drawStars();
    drawGrid();
    drawPlanets(); // **Draw planets instead of entities**
    drawSpeedOfLightEffect();

    requestAnimationFrame(draw);
  }

  function updateExplanation() {
    let explanationText = "";
    const absSpeed = Math.abs(speed);
    if (absSpeed === 0) {
      explanationText = "<b>At Rest:</b> Speed is zero. Observe the planets and starfield from a stationary perspective. Space and time appear normal, with a regular grid.";
    } else if (absSpeed > 0 && absSpeed <= 0.3) {
      explanationText = `<b>Moving Slowly (${speed.toFixed(2)}c):</b> Imagine observing planets while moving at a slow relativistic speed. Notice subtle <b>length contraction</b> in the grid and slight <b>time dilation</b>.`;
    } else if (absSpeed > 0.3 && absSpeed <= 0.7) {
      explanationText = `<b>Moving Moderately Fast (${speed.toFixed(2)}c):</b> Observing planets at a moderate relativistic speed. <b>Length contraction</b> and <b>time dilation</b> are now more apparent. The <b>Gamma Factor</b> (${gamma.toFixed(2)}) quantifies these effects.`;
    } else if (absSpeed > 0.7) {
      explanationText = `<b>Moving Very Fast (${speed.toFixed(2)}c - Near Light Speed!):</b> Approaching light speed while observing planets! <b>Length contraction</b> and <b>time dilation</b> become extreme. The large <b>Gamma Factor</b> (${gamma.toFixed(2)}) emphasizes this. The flashing overlay indicates near light speed.`;
    }

    explanationDiv.innerHTML = explanationText;
  }


  // Update speed when slider is changed
  speedControl.addEventListener('input', draw);


  // Initial setup and start animation
  updateExplanation();
  draw(); // **Ensure draw() is called to start animation loop**