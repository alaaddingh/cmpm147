/* project.js – driver for the over-world generator (global-mode)      */
/* global generateGrid1, drawGrid1, loadImage, select, createCanvas,
          image, randomSeed, noiseSeed */

let seed1 = 0;
let tilesetImage1;
let grid1 = [];
let rows1, cols1;
const SIZE = 16;

function preload() {
  tilesetImage1 = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function setup() {
  cols1 = select("#asciiBox1").attribute("rows") | 0;
  rows1 = select("#asciiBox1").attribute("cols") | 0;

  createCanvas(cols1 * SIZE, rows1 * SIZE)
       .parent("canvas-container-1")
       .elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton1").mousePressed(reseed1);
  select("#asciiBox1").input(importBox1);

  reseed1();
}

function draw() {
  randomSeed(seed1);         
  drawGrid1(grid1);           
}

function reseed1() {
  seed1 += 1109; randomSeed(seed1); noiseSeed(seed1);
  select("#seedReport1").html("seed "+seed1);

  grid1 = generateGrid1(cols1, rows1);
  select("#asciiBox1").value(gridToStr1(grid1));
}
function importBox1(){
  grid1 = select("#asciiBox1").value()
          .split("\n").map(l=>l.split(""));
}
function gridToStr1(g){ return g.map(r=>r.join("")).join("\n"); }

function placeTile1(i,j,ti,tj){
  image(tilesetImage1, SIZE*j, SIZE*i, SIZE, SIZE, 8*ti,8*tj,8,8);
}
