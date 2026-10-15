/* Pure geometry helpers for editable axonometric vector extrusion.
 * Input: one simple closed contour using explicit uppercase M/L/Q/C/Z,
 * decimal coordinates; no SVG arcs, holes, self-intersections or compound paths.
 * Curves remain analytic cubic Beziers. Sampling is used only for winding.
 * Embed this whole file before the task code in use_figma, or require it in Node.
 */
var IsoBezier = (() => {

const F=n=>Math.round(n*10000)/10000;
const P=p=>p.map(F).join(' ');
const add=(p,q)=>[p[0]+q[0],p[1]+q[1]];
function segments(d){const t=d.match(/[MLCQZ]|-?\d*\.?\d+/g);let i=0,s=[],cur,start;while(i<t.length){const cmd=t[i++];if(cmd==='M'){cur=[+t[i++],+t[i++]];start=cur;}else if(cmd==='L'){const e=[+t[i++],+t[i++]];s.push([cur,cur,e,e]);cur=e;}else if(cmd==='C'){const b=[+t[i++],+t[i++]],c=[+t[i++],+t[i++]],e=[+t[i++],+t[i++]];s.push([cur,b,c,e]);cur=e;}else if(cmd==='Q'){const q=[+t[i++],+t[i++]],e=[+t[i++],+t[i++]];s.push([cur,[cur[0]+2/3*(q[0]-cur[0]),cur[1]+2/3*(q[1]-cur[1])],[e[0]+2/3*(q[0]-e[0]),e[1]+2/3*(q[1]-e[1])],e]);cur=e;}else if(cmd==='Z'){if(Math.hypot(cur[0]-start[0],cur[1]-start[1])>.00001)s.push([cur,cur,start,start]);cur=start;}}return s;}
const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
function split(s,t){const a=lerp(s[0],s[1],t),b=lerp(s[1],s[2],t),c=lerp(s[2],s[3],t),d=lerp(a,b,t),e=lerp(b,c,t),f=lerp(d,e,t);return [[s[0],a,d,f],[f,e,c,s[3]]];}
function roots(s,off){const z=s.map(p=>p[0]*off[1]-p[1]*off[0]);const a=-z[0]+3*z[1]-3*z[2]+z[3],b=2*(z[0]-2*z[1]+z[2]),c=z[1]-z[0];let r=[];if(Math.abs(a)<1e-9){if(Math.abs(b)>1e-9)r=[-c/b];}else{const disc=b*b-4*a*c;if(disc>=0)r=[(-b+Math.sqrt(disc))/(2*a),(-b-Math.sqrt(disc))/(2*a)];}return r.filter(t=>t>1e-7&&t<1-1e-7).sort((a,b)=>a-b).filter((v,i,a)=>i===0||Math.abs(v-a[i-1])>1e-7);}
function normalized(s){let area=0;for(const q of s){let prev=q[0];for(let k=1;k<=16;k++){let t=k/16,u=1-t;let p=[u*u*u*q[0][0]+3*u*u*t*q[1][0]+3*u*t*t*q[2][0]+t*t*t*q[3][0],u*u*u*q[0][1]+3*u*u*t*q[1][1]+3*u*t*t*q[2][1]+t*t*t*q[3][1]];area+=prev[0]*p[1]-p[0]*prev[1];prev=p;}}return area>=0?s:s.slice().reverse().map(q=>[q[3],q[2],q[1],q[0]]);}
function asPath(s){return 'M'+P(s[0][0])+' '+s.map(q=>'C'+P(q[1])+' '+P(q[2])+' '+P(q[3])).join(' ')+' Z';}
function walls(s,off){s=normalized(s);let pieces=[];for(const q of s){let cut=roots(q,off),prev=0,remaining=q;for(const v of [...cut,1]){const ratio=(v-prev)/(1-prev);let part,rest;if(v===1){part=remaining;}else{[part,rest]=split(remaining,ratio);}let dir=(part[3][0]-part[0][0])*off[1]-(part[3][1]-part[0][1])*off[0];pieces.push({s:part,front:dir<-1e-6});remaining=rest;prev=v;}}
let cut=pieces.findIndex(p=>!p.front);if(cut>=0)pieces=pieces.slice(cut+1).concat(pieces.slice(0,cut+1));
let chains=[],chain=[];for(const p of pieces){if(p.front)chain.push(p.s);else if(chain.length){chains.push(chain);chain=[];}}if(chain.length)chains.push(chain);
return chains.map(ch=>{let d='M'+P(ch[0][0]);for(const q of ch)d+=' C'+P(q[1])+' '+P(q[2])+' '+P(q[3]);d+=' L'+P(add(ch[ch.length-1][3],off));for(const q of ch.slice().reverse())d+=' C'+P(add(q[2],off))+' '+P(add(q[1],off))+' '+P(add(q[0],off));return d+' Z';}).join(' ');}
function tx(s,fn){return s.map(q=>q.map(fn));}
const proj=(cx=110,cy=61,sc=.8,ox=60,oy=50)=>p=>[cx+.866*sc*((p[0]-ox)-(p[1]-oy)),cy+.5*sc*((p[0]-ox)+(p[1]-oy))];
function rp(p,r=12){let d='';for(let i=0;i<p.length;i++){let a=p[(i+p.length-1)%p.length],b=p[i],c=p[(i+1)%p.length],la=Math.hypot(a[0]-b[0],a[1]-b[1]),lb=Math.hypot(c[0]-b[0],c[1]-b[1]),ra=Math.min(r,la/3),rb=Math.min(r,lb/3),u=[b[0]+(a[0]-b[0])*ra/la,b[1]+(a[1]-b[1])*ra/la],v=[b[0]+(c[0]-b[0])*rb/lb,b[1]+(c[1]-b[1])*rb/lb];d+=(i?' L':'M')+P(u)+' Q'+P(b)+' '+P(v);}return segments(d+' Z');}
function exact(id,s,off,top,left,right,edge){return '<defs><linearGradient id="'+id+'-side-gradient" x1="0" y1="0" x2="1" y2="0"><stop stop-color="'+left+'"/><stop offset="1" stop-color="'+right+'"/></linearGradient></defs><path id="'+id+'-Continuous-side" d="'+walls(s,off)+'" fill="url(#'+id+'-side-gradient)"/><path id="'+id+'-Top" d="'+asPath(s)+'" fill="'+top+'" '+(edge?'stroke="'+edge+'" stroke-width=".8" stroke-linejoin="round"':'')+'/>';}

function checkPoint(p) {
  if (!Array.isArray(p) || p.length !== 2 || !p.every(Number.isFinite))
    throw new Error('Expected a finite [x,y] point.');
}
function checkContour(s) {
  if (!Array.isArray(s) || !s.length) throw new Error('Expected a nonempty contour.');
  for (let i=0;i<s.length;i++) {
    if (!Array.isArray(s[i]) || s[i].length !== 4) throw new Error('Each cubic needs four points.');
    s[i].forEach(checkPoint);
    const next=s[(i+1)%s.length][0], end=s[i][3];
    if (Math.hypot(end[0]-next[0],end[1]-next[1])>1e-6)
      throw new Error('Contour must be continuous and closed.');
  }
}
function parseClosed(d) {
  if (typeof d!=='string' || !/^\s*M/.test(d) || !/Z\s*$/.test(d))
    throw new Error('Use one closed path beginning M and ending Z.');
  if ((d.match(/M/g)||[]).length!==1 || (d.match(/Z/g)||[]).length!==1)
    throw new Error('Compound paths require separate contour handling.');
  if (/[A-Za-z]/.test(d.replace(/[MLCQZ]/g,'')))
    throw new Error('Only explicit uppercase M/L/Q/C/Z with decimal coordinates are supported.');
  if (/[^MLCQZ0-9.,\s-]/.test(d)) throw new Error('Unsupported path syntax.');
  const tok=d.match(/[MLCQZ]|-?\d*\.?\d+/g)||[];
  const arity={M:2,L:2,Q:4,C:6,Z:0};
  for(let i=0;i<tok.length;){
    const cmd=tok[i++];if(!(cmd in arity))throw new Error('Write each command explicitly.');
    for(let k=0;k<arity[cmd];k++){
      const value=tok[i++];if(value===undefined || !Number.isFinite(Number(value)))
        throw new Error('Invalid or missing coordinate.');
    }
  }
  const s=segments(d);checkContour(s);return s;
}
function transform(s,fn) {checkContour(s);const out=tx(s,fn);checkContour(out);return out;}
function sidePath(s,offset) {
  checkContour(s);checkPoint(offset);
  if (Math.hypot(...offset)<1e-9)throw new Error('Extrusion offset must be nonzero.');
  return walls(s,offset);
}
function topPath(s) {checkContour(s);return asPath(s);}
function roundPolygon(points,radius) {
  if (!Array.isArray(points)||points.length<3)throw new Error('Need at least three polygon vertices.');
  points.forEach(checkPoint);
  if (!Number.isFinite(radius)||radius<0)throw new Error('Radius must be finite and nonnegative.');
  for(let i=0;i<points.length;i++){
    if(Math.hypot(points[i][0]-points[(i+1)%points.length][0],points[i][1]-points[(i+1)%points.length][1])<1e-9)
      throw new Error('Adjacent polygon vertices must differ.');
  }
  const out=rp(points,radius);checkContour(out);return out;
}
return {
  parseClosed, transform, topPath, sidePath, roundPolygon,
  reverse: s => {checkContour(s);return s.slice().reverse().map(q=>[q[3],q[2],q[1],q[0]]);},
  translate: (s,offset) => {checkPoint(offset);return transform(s,p=>add(p,offset));}
};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = IsoBezier;
