"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/


function p3_preload() {}
function p3_setup() {}

let worldSeed;
function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth()  { return 20; }
function p3_tileHeight() { return 32; }
const [tw, th] = [p3_tileWidth(), p3_tileHeight()];
const clicks = Object.create(null);
function p3_tileClicked(i, j) { clicks[[i, j]] = 1 + (clicks[[i, j]] | 0); }

function p3_drawBefore() {
  push();
  resetMatrix();
  background(255); 

  randomSeed(worldSeed); 

  stroke(0, 0, 0, 15);
  strokeWeight(1);

  let spacing = random(10, 30)
  let offset = random(0, spacing);

  for (let x = -width; x < width * 2; x += spacing) {
    line(x + offset, 0, x - height + offset, height);
  }
  for (let x = -width; x < width * 2; x += spacing) {
    line(x - offset, height, x + height - offset, 0);
  }

  pop();
}

function drawOliveSprig(x, y, angleR) {
  push();
  translate(x, y);
  rotate(angleR);
  noStroke();
  fill(0, 140, 40);
  ellipse(-3, 0, 7, 10);
  ellipse(3, 0, 7, 4);
  stroke(0, 100, 30);
  strokeWeight(1.2);
  line(-4, 0, 4, 0);
  pop();
}

function drawHemmingBands() {
  push();
  resetMatrix();
  noStroke();

  const bandH = min(20, height);
  const thin = 0.1 * bandH;
  const medium = 0.2 * bandH;
  const thick = bandH - 2 * thin - 1 * medium;

  const drawOneBand = (y) => {
    fill(240);
    rect(0, y, width, 40);

    fill(0);
    let yCursor = y;
    rect(0, yCursor, width, medium);
    yCursor += thin;

    fill(130);
    rect(0, yCursor + 10, width, thick);
    yCursor += thick;

    fill(0);
    rect(0, yCursor + 20, width, medium);

    stroke(255);
    strokeWeight(1);
    const fringeY = y + bandH;
    for (let t = 4; t < width; t += 8) {
      line(t, fringeY, t, fringeY + 5);
    }
  };

  drawOneBand(0);
  drawOneBand(height - bandH - 20);

  pop();
}

function p3_drawAfter() { drawHemmingBands(); }

function p3_drawTile(i, j) {
  const dotSeed1 = XXH.h32("dot1:" + [i, j], worldSeed);
  const dotSeed2 = XXH.h32("dot2:" + [i, j], worldSeed);
  const dot1 = (dotSeed1 % 6) + 2;
  const dot2 = (dotSeed2 % 6) + 2;

  push();

  const n = noise(i * 0.4, j * 0.4);        
  const baseTan   = color(240, 300, 400);  
  const darkerTan = color(245, 235, 100);   
  const c = lerpColor(baseTan, darkerTan, n);  
  fill(c);                                  
  strokeWeight(3);
  beginShape();
  vertex(-tw, 0); vertex(0, th); vertex(tw, 0); vertex(0, -th);
  endShape(CLOSE);

  
  const hatchSeed = XXH.h32("hatch:" + i + "," + j, worldSeed);
  randomSeed(hatchSeed);             
  const strokeval = random(40, 60);
  stroke(0, strokeval);                     
  strokeWeight(1);

  const spacing = floor(random(10, 20));   
  const offset  = random(0, spacing);       

  for (let x = -tw - th; x < tw + th; x += spacing) {
    line(x + offset,  -th, x + offset + tw + th,  th);  
    line(x + offset,   th, x + offset + tw + th, -th);  
  }

  

  strokeWeight(10);
  stroke(0);
  if ((dotSeed1 & 3) === 0) drawOliveSprig(dot1 + 15, 0, dotSeed1 % TWO_PI);
  else                      point(dot1 + 15, 0);

  if ((dotSeed2 & 3) === 0) drawOliveSprig(dot2 + 15, -64, dotSeed2 % TWO_PI);
  else                      point(dot2 + 15, -64);

  if ((clicks[[i, j]] | 0) % 2 === 1) {
    const phase = XXH.h32("phase:" + [i, j], worldSeed) & 0xff;
    makeWatermelon(phase);
  }

  pop();
}


function makeWatermelon(phase = 0) {
  push();
  angleMode(RADIANS);
  const sway = sin((frameCount + phase) * 0.05) * 10;
  translate(0, -6 + sway);

  const shadowAlpha = map(abs(sway), 0, 10, 80, 20);
  noStroke();
  fill(0, 0, 0, shadowAlpha);
  ellipse(0, 12, 18, 6);

  noStroke();
  fill(255, 0, 0);
  arc(0, 0, 20, 20, 0, PI, PIE);
  noFill();
  stroke(0, 200, 0);
  strokeWeight(4);
  arc(0, 0, 22, 22, 0, PI);

  noStroke();
  fill(0);
  [-0.9, 0, 3.3, 3.7].forEach(a =>
    ellipse(6 * cos(a), -6 * sin(a) + 1, 3, 3)
  );

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  push();
  stroke(0, 0, 0, 25);
  strokeWeight(1);
  for (let d = -tw; d <= tw; d += 4) {
    line(d, -th, d + tw, th);
    line(d, th, d + tw, -th);
  }
  pop();

  noStroke();
  fill(0);
  text(`tile ${i},${j}`, 0, 0);
}
