/* project2.js – driver for Dungeon generator #2 (global-mode) */
/* global generateGrid2, drawGrid2, loadImage, select, createCanvas,
          image, floor, mouseX, mouseY */

let seed2 = 0;
let tilesetImage2;
let grid2 = [];
let rows2, cols2;
const SIZE = 16;
let hover2 = { x:-1, y:-1 };

function preload() {                    // <- renamed from preload2
  tilesetImage2 = window.tilesetImage ||
      loadImage("https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438",
                img => window.tilesetImage = img);
}

function setup() {                      // <- renamed from setup2
  cols2 = select("#asciiBox2").attribute("rows") | 0;
  rows2 = select("#asciiBox2").attribute("cols") | 0;

  createCanvas(cols2 * SIZE, rows2 * SIZE)
        .parent("canvas-container-2")
        .elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton2").mousePressed(reseed2);
  select("#asciiBox2").input(importBox2);
  reseed2();
}

function draw() {                       // <- renamed from draw2
  randomSeed(seed2);
  hover2.x = floor(mouseX / SIZE);
  hover2.y = floor(mouseY / SIZE);
  drawGrid2(grid2, hover2);
}

/* helpers – unchanged */
function reseed2(){
  seed2 += 1109; randomSeed(seed2); noiseSeed(seed2);
  select("#seedReport2").html("seed " + seed2);
  grid2 = generateGrid2(cols2, rows2);
  select("#asciiBox2").value(gridToStr2(grid2));
}
function importBox2(){ grid2 = strToGrid2(select("#asciiBox2").value()); }
function gridToStr2(g){ return g.map(r=>r.join("")).join("\n"); }
function strToGrid2(s){ return s.split("\n").map(l=>l.split("")); }

function placeTile(i,j,ti,tj){
  image(tilesetImage2, SIZE*j, SIZE*i, SIZE, SIZE, 8*ti,8*tj,8,8);
}

/* tell p5 to start a second global-mode sketch */
new p5();
