// R5/render-fx.js — Effect Particle Renderer
// Ring 5: sparkles, fire, confetti, lightning.

export function drawSparkles(ctx, seed, frame, sz) {
  ctx.save(); ctx.globalAlpha=0.8;
  for(let i=0;i<12;i++){
    const ph=(seed+i*137)%1000/1000;
    const x=ph*sz, y=(ph*7+frame*3)%sz, r=2+Math.sin(frame*0.5+i)*2;
    ctx.fillStyle='#FFD700'; star4(ctx,x,y,r);
  }
  ctx.restore();
}

export function drawConfetti(ctx, seed, frame, sz) {
  const C=['#FF4500','#00BFFF','#FFD700','#FF69B4','#32CD32','#8A2BE2'];
  ctx.save(); ctx.globalAlpha=0.6;
  for(let i=0;i<20;i++){
    const ph=(seed+i*97)%1000/1000, x=ph*sz, y=(ph*5+frame*4)%(sz+20)-10;
    ctx.fillStyle=C[i%C.length]; ctx.save(); ctx.translate(x,y); ctx.rotate(frame*0.1+i);
    ctx.fillRect(-3,-1,6,2); ctx.restore();
  }
  ctx.restore();
}

export function drawFireFX(ctx, seed, frame, sz) {
  ctx.save(); ctx.globalAlpha=0.5;
  for(let i=0;i<8;i++){
    const ph=(seed+i*73)%1000/1000, x=sz*0.3+ph*sz*0.4, y=sz*0.8-(frame*5+i*10)%(sz*0.5);
    const r=4+Math.sin(frame*0.3+i)*3;
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'#FFD700'); g.addColorStop(0.5,'#FF8C00'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

export function drawLightning(ctx, seed, frame, sz) {
  if(frame%2) return;
  ctx.save(); ctx.strokeStyle='#00FF7F'; ctx.lineWidth=2; ctx.globalAlpha=0.7;
  let bx=sz*0.3+(seed%100)/100*sz*0.4, by=0;
  ctx.beginPath(); ctx.moveTo(bx,0);
  while(by<sz){ bx+=(Math.random()-0.5)*30; by+=15+Math.random()*20; ctx.lineTo(bx,by); }
  ctx.stroke(); ctx.restore();
}

function star4(ctx,x,y,r){
  ctx.beginPath();
  for(let i=0;i<4;i++){
    const a=(i/4)*Math.PI*2-Math.PI/2;
    if(i===0)ctx.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);
    else ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);
    const ia=a+Math.PI/4;
    ctx.lineTo(x+Math.cos(ia)*r*0.3,y+Math.sin(ia)*r*0.3);
  }
  ctx.closePath(); ctx.fill();
}
