/* grid2.js  – Dungeon-room generator for canvas #2               */
/* exported generateGrid2, drawGrid2 */
/* global placeTile, floor, random, min, max, background, fill,
          noStroke, rect */
          const placeTile = window.placeTile; 

          function generateGrid2(cols, rows) {
            const grid = Array.from({length: rows}, () => Array(cols).fill("_"));
            const rooms = [];
            const MAX_ROOMS = 12;
          
            for (let n=0; n<MAX_ROOMS; n++){
              const w = floor(random(4,8));
              const h = floor(random(3,6));
              const x0 = floor(random(1, cols-w-1));
              const y0 = floor(random(1, rows-h-1));
          
              if (rooms.some(r=> x0<r.x+r.w && x0+w>r.x && y0<r.y+r.h && y0+h>r.y)) continue;
          
              for (let y=y0; y<y0+h; y++){
                for (let x=x0; x<x0+w; x++){
                  grid[y][x] =
                    (x===x0||x===x0+w-1||y===y0||y===y0+h-1) ? "f"
                    : random()<0.6 ? "b" : "c";
                }
              }
          
              if (rooms.length){
                const prev = rooms[rooms.length-1];
                const pc = {x:floor(prev.x+prev.w/2), y:floor(prev.y+prev.h/2)};
                const nc = {x:floor(x0+w/2),          y:floor(y0+h/2)};
          
                if (random()<0.5){
                  carveH(grid, pc.x, nc.x, pc.y, "h");
                  carveV(grid, pc.y, nc.y, nc.x, "h");
                } else {
                  carveV(grid, pc.y, nc.y, pc.x, "h");
                  carveH(grid, pc.x, nc.x, nc.y, "h");
                }
              }
          
              rooms.push({x:x0,y:y0,w,h});
            }
            return grid;
          }
          
          function carveH(g,x1,x2,y,t){ for(let x=min(x1,x2); x<=max(x1,x2); x++){ if(g[y][x]==="_")g[y][x]=t; } }
          function carveV(g,y1,y2,x,t){ for(let y=min(y1,y2); y<=max(y1,y2); y++){ if(g[y][x]==="_")g[y][x]=t; } }
          
          function drawGrid2(grid, hover={x:-1,y:-1}) {
            background(30);
          
            for(let i=0;i<grid.length;i++){
              for(let j=0;j<grid[i].length;j++){
                const c = grid[i][j];
                const H = hover.x===j && hover.y===i;
          
                if(c==="f"){ placeTile(i,j,1,21);}
                else if(c==="b"){ placeTile(i,j,0,2);}
                else if(c==="c"){ placeTile(i,j,0,2);}
                else if(c==="h"){ placeTile(i,j,1,16);}
                else if(c==="_"){ placeTile(i,j,12,21);}
          
                if(H && (c==="b"||c==="c")){
                  noStroke();fill(255,255,150,100);
                  rect(j*16,i*16,32,32);
                  if(c==="c") placeTile(i,j,0,28);
                }
              }
            }
          }
          