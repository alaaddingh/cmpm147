/* exported getInspirations, initDesign, renderDesign, mutateDesign */

function getInspirations() {
  return [
    {
      name: "Rain on Window",
      assetUrl: "https://cdn.glitch.global/cff9167e-d49e-476d-859f-e11ecc3bc616/thumbnails%2Fcar%20window%20image.jpg?1746765103765",
      credit: "Original Photo",
      params: { 
        canvasScale: 0.5,
        clusterCount: 10, dropCount: 100, dropLargeProb: 0.1,
        skyTopRange: [[200,220],[200,220],[210,230]],
        skyBotRange: [[140,160],[140,160],[150,170]],
        treeSizeFrac: [0.1,0.25], treeHeightFrac:[0.2,0.5], treeDots:[12,20],
        dropSizeLarge:[[0.015,0.03],[0.05,0.1]],
        dropSizeSmall:[[0.002,0.008],[0.01,0.03]]
      }
    },
    {
      name: "Foggy Forest",
      assetUrl: "https://cdn.glitch.global/cff9167e-d49e-476d-859f-e11ecc3bc616/foggy%20forest.jpg?v=1746769023677",
      credit: "Original Photo",
      params: {
        canvasScale: 0.5,
        clusterCount: 5,
        dropCount: 60,
        dropLargeProb: 1,
        skyTopRange: [[180,200],[180,200],[180,200]],
        skyBotRange: [[160,180],[160,180],[160,180]],
        treeSizeFrac: [0.05,0.6], treeHeightFrac:[0.3,0.6], treeDots:[10,20],
        dropSizeLarge:[[0.2,0.4],[0.05,0.1]],
        dropSizeSmall:[[0.1,0.2],[0.02,0.05]]
      }
    },
    {
      name: "Green Bubbles",
      assetUrl: "https://cdn.glitch.global/cff9167e-d49e-476d-859f-e11ecc3bc616/thumbnails%2Fbubbles_img.jpg?1746842051212",
      credit: "Original Photo",
      params: {
        canvasScale: 0.5,
        dropCount: 80,
        dropLargeProb: 0.8,
        dropSizeLarge: [0.05,0.15], 
        dropSizeSmall: [0.01,0.05],
        patchCount: 30,
        patchSizeRange: [[0.1,0.3],[0.1,0.3]],
        patchAlphaRange: [100,200]
      }
    }
  ];
}

function initDesign(inspiration) {
  const p = inspiration.params;
  resizeCanvas(
    inspiration.image.width * p.canvasScale,
    inspiration.image.height * p.canvasScale
  );
  const w = width, h = height;

   const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${w}px;">`;
  document.getElementById('original').innerHTML = imgHTML;
  document.querySelector('.caption').textContent = inspiration.credit;

  let skyTop, skyBot;
  if (inspiration.name === "Green Bubbles") {
    skyTop = [random(220,255), random(240,255), random(220,255)];
    skyBot = [random(200,240), random(220,250), random(200,240)];
  } else {
    skyTop = p.skyTopRange.map(r => random(r[0], r[1]));
    skyBot = p.skyBotRange.map(r => random(r[0], r[1]));
  }

  let trees = [];
  if (inspiration.name !== "Green Bubbles") {
    for (let i = 0; i < p.clusterCount; i++) {
      let cx    = random(w),
          treeW = random(p.treeSizeFrac[0]*w, p.treeSizeFrac[1]*w),
          treeH = random(p.treeHeightFrac[0]*h, p.treeHeightFrac[1]*h),
          M     = floor(random(p.treeDots[0], p.treeDots[1]));

      if (inspiration.name === "Foggy Forest") {
        let tris = [];
        for (let j = 0; j < M; j++) {
          let apexX   = cx + random(-treeW/2, treeW/2);
          let apexY   = random(h * 0.3, h * 0.8);
          let baseW   = random(treeW*0.1, treeW*0.3);
          let heightT = random(treeH*0.3, treeH);
          tris.push({ x: apexX, y: apexY, baseW, h: heightT, tone: random(30,80), alpha: random(80,200) });
        }
        trees.push({ type: "tri", trs: tris, treeH });
      } else {
        let circles = [];
        for (let j = 0; j < M; j++) {
          const d = random(treeW*0.2, treeW*0.6);
          const cy = h - random(0, treeH);
          circles.push({ x: cx + random(-treeW/2, treeW/2), y: cy, d, tone: random(30,80), alpha: random(50,150) });
        }
        trees.push({ type: "cir", circles, treeH });
      }
    }
  }

  let drops = [];
  if (inspiration.name === "Green Bubbles") {
    // perfectly circular bubbles
    const base = min(w, h);
    for (let i = 0; i < p.dropCount; i++) {
      let isLarge = random() < p.dropLargeProb;
      let range   = isLarge ? p.dropSizeLarge : p.dropSizeSmall;
      const d0 = random(range[0]*base, range[1]*base);
      drops.push({ x: random(w), y: random(h), w: d0, h: d0, alpha: random(100,255) });
    }
  } else {
    for (let i = 0; i < p.dropCount; i++) {
      let isLarge = random() < p.dropLargeProb;
      let [wR,hR] = isLarge ? p.dropSizeLarge : p.dropSizeSmall;
      const w0 = random(wR[0]*w, wR[1]*w),
            h0 = random(hR[0]*h, hR[1]*h);
      drops.push({ x: random(w), y: random(h), w: w0, h: h0, alpha: inspiration.name=== "Foggy Forest" ? random(150,255) : random(30,150), cluster: floor(random(p.clusterCount)) });
    }
  }

  let patches = [];
  if (inspiration.name === "Green Bubbles") {
    for (let i = 0; i < p.patchCount; i++) {
      let pr    = random(p.patchSizeRange[0][0]*w, p.patchSizeRange[0][1]*w);
      let alpha = random(p.patchAlphaRange[0], p.patchAlphaRange[1]);
      let col   = random() < 0.5 ? [255,255,255] : [random(50,150), random(200,255), random(50,150)];
      patches.push({ x: random(w), y: random(h), r: pr, alpha, col });
    }
  }

  return { skyTop, skyBot, trees, drops, patches };
}

function renderDesign(design, inspiration) {
  if (!design) return;
  const { skyTop, skyBot, trees, drops, patches } = design;

  noStroke();
  for (let y = 0; y < height; y++) {
    let t = y/height, r = lerp(skyTop[0], skyBot[0], t), g = lerp(skyTop[1], skyBot[1], t), b = lerp(skyTop[2], skyBot[2], t);
    fill(r,g,b); rect(0,y,width,1);
  }

  if (inspiration.name !== "Green Bubbles") {
    for (let tree of trees) {
      if (tree.type === "cir") for (let c of tree.circles) { fill(c.tone*0.6, c.tone+10, c.tone*0.6, c.alpha); ellipse(c.x,c.y,c.d,c.d); }
      else for (let t of tree.trs) { fill(t.tone*0.6, t.tone+10, t.tone*0.6, t.alpha); triangle(t.x,t.y, t.x-t.baseW/2,t.y+t.h, t.x+t.baseW/2,t.y+t.h); }
    }
  }

  if (inspiration.name === "Rain on Window") {
    for (let d of drops) {
      fill(255,255,255, d.alpha*0.05); ellipse(d.x,d.y,d.w,d.h);
      let rs = map(d.y,0,height,0.3,1), ra = 100*rs, rw = d.w*0.03+rs*2;
      noFill(); stroke(0,ra); strokeWeight(rw); arc(d.x,d.y,d.w,d.h, PI,TWO_PI); noStroke();
      let tree = trees[d.cluster], sc = d.h/(tree.treeH*2);
      if (tree.type==="cir") for (let c of tree.circles) { let dx=c.x-tree.cx, dy=height-c.y; fill(c.tone,c.alpha*0.4); ellipse(d.x-dx*sc,d.y-dy*sc,c.d*sc*0.5,c.d*sc*0.5); }
      stroke(255, d.alpha*0.1); strokeWeight(d.w*0.02); noFill(); arc(d.x,d.y,d.w,d.h, PI+QUARTER_PI,TWO_PI+QUARTER_PI); noStroke();
    }
  } else if (inspiration.name === "Green Bubbles") {
    for (let pch of patches) { fill(pch.col[0],pch.col[1],pch.col[2],pch.alpha); ellipse(pch.x,pch.y,pch.r,pch.r); }
    for (let d of drops) {
      fill(255,255,255, d.alpha*0.2); ellipse(d.x,d.y,d.w,d.h);
      stroke(255, d.alpha*0.3); strokeWeight(d.w*0.05); noFill(); ellipse(d.x,d.y,d.w,d.h); noStroke();
      fill(0, random(150,255), 0, d.alpha*0.15);
      ellipse(d.x - d.w*0.1, d.y - d.h*0.1, d.w*0.5, d.h*0.5);
    }
  } else {
    for (let d of drops) { fill(245,245,245, d.alpha*0.4); ellipse(d.x,d.y,d.w,d.h); fill(245,245,245, d.alpha*0.3); ellipse(d.x+d.w*0.1,d.y+d.h*0.1,d.w,d.h); }
  }
}

function mutateDesign(design, inspiration, rate) {
  if (!design) return;
  let r = rate;

  for (let arr of [design.skyTop, design.skyBot]) for (let i=0; i<3; i++) arr[i] = constrain(randomGaussian(arr[i], r*30), 0, 255);

  for (let tree of design.trees) {
    if (tree.type === "cir") for (let c of tree.circles) { c.x=constrain(randomGaussian(c.x,r*width*0.02),0,width); c.y=constrain(randomGaussian(c.y,r*height*0.02),0,height); c.d=constrain(randomGaussian(c.d,r*width*0.02),5,width*0.5); c.tone=constrain(randomGaussian(c.tone,r*40),0,100); c.alpha=constrain(randomGaussian(c.alpha,r*100),30,255); }
    else for (let t of tree.trs) { t.x=constrain(randomGaussian(t.x,r*width*0.02),0,width); t.y=constrain(randomGaussian(t.y,r*height*0.02),0,height); t.baseW=constrain(randomGaussian(t.baseW,r*width*0.02),2,width*0.5); t.h=constrain(randomGaussian(t.h,r*height*0.02),2,height*0.5); t.tone=constrain(randomGaussian(t.tone,r*40),0,100); t.alpha=constrain(randomGaussian(t.alpha,r*100),30,255); }
  }

  for (let d of design.drops) {
    d.x = constrain(randomGaussian(d.x, r*width*0.05), 0, width);
    d.y = constrain(randomGaussian(d.y, r*height*0.05), 0, height);
    if (inspiration.name === "Green Bubbles") {
      d.w = constrain(randomGaussian(d.w, r*width*0.01), 2, width*0.5);
      d.h = d.w;
      d.alpha = constrain(randomGaussian(d.alpha, r*100), 10, 255);
    } else {
      d.w = constrain(randomGaussian(d.w, r*width*0.01), 2, width*0.5);
      d.h = constrain(randomGaussian(d.h, r*height*0.02),2,height*0.5);
      d.alpha = constrain(randomGaussian(d.alpha, r*100), 10, 255);
    }
  }

  if (inspiration.name === "Green Bubbles") {
    for (let pch of design.patches) {
      pch.x = constrain(randomGaussian(pch.x, r*width*0.05), 0, width);
      pch.y = constrain(randomGaussian(pch.y, r*height*0.05), 0, height);
      pch.alpha = constrain(randomGaussian(pch.alpha, r*100), 10, 255);
    }
  }
}
