/* Night‑Sky Procedural Generator (p5.js)
   Author: Ala'addin Ghosheh
   Date: 2025‑04‑14

   ‑ This script creates a night sky scene with a crescent moon, stars, and clouds.
   ‑ Includes a "Reimagine" button to shuffle the procedural seed.
*/

const moonColor      = "#EBFBFD";
const lowerskyColor  = "#a3dbec";
const lowerskyColor2 = "#c1f6ef";
const midskyColor    = "#7b98d4";
const midskyColor2   = "#3f354f";
const upperskyColor  = "#030627";
const treeColor      = "#0B0b17";
const treeColor2     = "#2c3e6e";
const cloudColor     = "#9679b9";

let seed = 239;
let gradientShape;          
let stars = [];            
let clouds = [];           
let canvasContainer;        
var centerHorz, centerVert;

function regenerateScene() {
  gradientShape = createGraphics(width, height);
  drawGradientShape();

  // Stars
  stars = [];
  for (let i = 0; i < 80; i++) {
    stars.push({
      x: random(width),
      y: random(height / 2),
      baseSize: random(0.5, 2),
      flickerSpeed: random(0.01, 0.03),
      flickerPhase: random(TWO_PI)
    });
  }

  // Clouds
  clouds = [];
  for (let i = 0; i < int(random(3, 6)); i++) {
    clouds.push({
      x: random(width),
      y: random(height * 0.05, height * 0.65),
      size: random(40, 100),
      speed: random(0.2, 0.5),
      offset: random(TWO_PI)
    });
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width()  / 2;
  centerVert = canvasContainer.height() / 2;
  resizeCanvas(canvasContainer.width(), canvasContainer.height() / 3);
  regenerateScene();
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  $("<button>Reimagine</button>")
    .attr("id", "reimagine")
    .appendTo(".minor-section:first") 
    .on("click", () => { seed++; regenerateScene(); });

  $("#fullscreen").on("click", () => {
    let fs = fullscreen();
    fullscreen(!fs);
  });

  regenerateScene();
  $(window).resize(() => resizeScreen());
  resizeScreen();
}

function draw() {
  randomSeed(seed); 
  background(100);
  noStroke();

  // Base midsky
  fill(midskyColor);
  rect(0, 0, width, height);

  // Layered midsky band
  fill(midskyColor2);
  beginShape();
  const steps3 = 40;
  const topY2  = height / 8;
  const baseY2 = height / 2;
  for (let i = 0; i <= steps3; i++) {
    vertex((width * i) / steps3, baseY2 + random(5, 20));
  }
  vertex(width, topY2);
  vertex(0, topY2);
  endShape(CLOSE);

  // Gradient overlay
  image(gradientShape, 0, height / 8);

  // Upper sky ridge
  fill(upperskyColor);
  beginShape();
  const steps = 20;
  const baseY = height / 2;
  for (let i = 0; i <= steps; i++) {
    let x = (width * i) / steps;
    let d = abs(x - width / 2) / (width / 2);
    let y = baseY - pow(1 - d, 2) * 45 - random(5, 30);
    vertex(x, y);
  }
  vertex(width, 0);
  vertex(0, 0);
  endShape(CLOSE);

  // Lower sky
  fill(lowerskyColor);
  beginShape();
  vertex(0, height - 10);
  const steps2 = 20;
  for (let i = 0; i <= steps2; i++) {
    let x = (width * i) / steps2;
    let y = (height - 20) - (random() ** 3 * height) / 8;
    vertex(x, y);
  }
  vertex(width, height - 10);
  endShape(CLOSE);

  // 6) Fog band
  fill(lowerskyColor2);
  beginShape();
  vertex(0, height - 10);
  const steps4 = 30;
  for (let i = 0; i <= steps4; i++) {
    vertex((width * i) / steps4, height - 10 - random(3, 10));
  }
  vertex(width, height - 10);
  endShape(CLOSE);

  // 7) Crescent moon
  drawCrescentMoon(width / 1.5, height / 6, 32);

  // 8) Clouds (before trees)
  drawClouds();

  // 9) Background trees
  for (let i = 0; i < int(random(60, 100)); i++) {
    drawPineTree(random(width), height + 30, random(5, 40), treeColor2);
  }

  // 10) Foreground trees
  for (let i = 0; i < int(random(30, 49)); i++) {
    drawPineTree(random(width), height + 30, random(5, 40), treeColor);
  }

  // 11) Ground strip
  fill(treeColor);
  rect(0, height - 20, width, height - 10);

  // 12) Stars (overlay)
  for (const s of stars) {
    let flicker = sin(frameCount * s.flickerSpeed + s.flickerPhase) * 0.5 + 0.5;
    fill(180 + flicker * 75);
    circle(s.x, s.y, s.baseSize + flicker * 1.5);
  }
}

// ---------------------- Helper functions
function drawCrescentMoon(x, y, r) {
  noStroke();
  fill(moonColor);
  ellipse(x, y, r, r);
  fill(upperskyColor);
  ellipse(x + r * 0.3, y, r, r);
}

function drawGradientShape() {
  for (let y = 0; y < height; y++) {
    let col;
    if (y < height / 2) {
      col = lerpColor(color(upperskyColor), color(midskyColor), pow(y / (height / 2), 2));
    } else {
      let amt = constrain((y - height * 0.6) / (height * 0.1), 0, 1);
      col = lerpColor(color(midskyColor), color(lowerskyColor), pow(amt, 2));
    }
    gradientShape.stroke(col);
    gradientShape.line(0, y, width, y);
  }
}

function drawPineTree(x, yBottom, size, col) {
  fill(col);
  noStroke();
  const tiers = 4;
  const tierH = (size * 2) / tiers;
  for (let i = 0; i < tiers; i++) {
    let top = yBottom - i * tierH;
    let bw  = size - i * (size / 4);
    triangle(x, top - tierH, x - bw / 2, top, x + bw / 2, top);
  }
  rect(x - size / 10, yBottom, size / 5, size / 5);
}

function drawClouds() {
  for (const c of clouds) {
    let drift = sin(frameCount * 0.01 + c.offset) * c.speed * 10;
    let x = c.x + drift;
    let y = c.y;
    fill(color(cloudColor + "88"));
    noStroke();
    ellipse(x, y, c.size, c.size / 2);
    ellipse(x + c.size * 0.3, y + c.size * 0.1, c.size * 0.8, c.size / 2.2);
    ellipse(x - c.size * 0.3, y + c.size * 0.1, c.size * 0.6, c.size / 2.2);
  }
}

function mousePressed() {
  // Currently unused – could trigger seed shuffle etc.
}
