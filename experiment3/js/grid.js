/* exported generateGrid1, drawGrid1 */
/* global placeTile1, noise, random, floor, sin, millis, background */

function generateGrid1(cols, rows) {
    const g=[];
    for(let i=0;i<rows;i++){
      const r=[];
      for(let j=0;j<cols;j++){
        const n = noise(i*0.1, j*0.1);
        if      (n<0.4)  r.push("w");
        else if (n<0.47) r.push("o");
        else if (n<0.52) r.push("g");
        else             r.push(random()>0.95 ? "t" : "_");
      }
      g.push(r);
    }
    return g;
  }
  
  function drawGrid1(g){
    background(128);
    for(let i=0;i<g.length;i++){
      for(let j=0;j<g[i].length;j++){
        const c=g[i][j];
        if(c==="_"){
          const roll=random();
          placeTile1(i,j, roll<0.85?0:roll<0.93?1:2, 1);
        }else if(c==="t"){
          const roll=random();
          placeTile1(i,j, roll<0.85?0:roll<0.93?1:2, 1);
          placeTile1(i,j,16,floor(random(3)));           // tree crown
        }else if(c==="w"){
          const phase=millis()*0.002;
          const frame=floor(((sin(i*0.5+phase)+1)/2)*3)%3;
          placeTile1(i,j,frame,13);
        }else if(c==="o") placeTile1(i,j,3,2);
        else if(c==="g")  placeTile1(i,j,2,3);
      }
    }
  }
  