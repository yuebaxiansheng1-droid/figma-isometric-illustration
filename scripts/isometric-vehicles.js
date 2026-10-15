/* Editable vehicle recipes for the standard ±30° isometric example.
 * Reuse/adapt only when these shapes suit the task; no Figma writes occur.
 * Node: require this file. Figma: embed bezier-extrusion.js, then this file.
 */
function createIsometricVehicleAssets(options = {}) {
 const G = typeof module !== 'undefined' && module.exports
  ? require('./bezier-extrusion.js')
  : typeof IsoBezier !== 'undefined' ? IsoBezier : null;
 if (!G) throw new Error('Embed bezier-extrusion.js before this recipe.');
 const Geometry = G;
const K=Math.sqrt(3)/2,F=n=>Math.round(n*10000)/10000,pt=q=>q.map(F).join(' ');
const COL={body:'#f8f9fd',edge:'#747a80',dark:'#323a40',glass:'#bfc6ce'};
const path=(name,d,fill='none',stroke=null,sw=.5,extra='')=>`<path id="${name}" d="${d}" fill="${fill}" ${stroke?`stroke="${stroke}" stroke-opacity=".84" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`:''} ${extra}/>`;
const svg=(b,w,h)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${b}</svg>`;
const d3=(cmds,pp,closed=false)=>cmds.map(([c,...qs])=>c+qs.map(q=>pt(pp(...q))).join(' ')).join(' ')+(closed?' Z':'');
function rr(x,y,w,h,r){const a=.5522847498;r=Math.min(r,w/2,h/2);return `M${x+r} ${y} L${x+w-r} ${y} C${x+w-r+a*r} ${y} ${x+w} ${y+r-a*r} ${x+w} ${y+r} L${x+w} ${y+h-r} C${x+w} ${y+h-r+a*r} ${x+w-r+a*r} ${y+h} ${x+w-r} ${y+h} L${x+r} ${y+h} C${x+r-a*r} ${y+h} ${x} ${y+h-r+a*r} ${x} ${y+h-r} L${x} ${y+r} C${x} ${y+r-a*r} ${x+r-a*r} ${y} ${x+r} ${y} Z`;}
const plane=(d,fn)=>Geometry.transform(Geometry.parseClosed(d.replace(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi,n=>String(F(+n)))),fn);
function design({w,h,ox,oy,L,W,H,dir,crossover,dark,roofInset=4.4,roofRadius=2.4,roofBack,roofFront}){
 const pp=(u,v,z)=>[ox+dir*K*(u-v),oy+(u+v)/2-z];
 const r=roofBack??(crossover?7.5:10.2),f=roofFront??(crossover?35.2:34.5),br=crossover?1.8:2.5,bf=crossover?43.5:43,bt=10.7,bl=4.25;
 const I=roofInset,R=roofRadius,arc=.4477152502*R;
 const planD=`M3.6 .3 L${L-5.6} .3 C${L-2.67} .3 ${L-.3} 2.67 ${L-.3} 5.6 L${L-.3} ${W-5.6} C${L-.3} ${W-2.67} ${L-2.67} ${W-.3} ${L-5.6} ${W-.3} L3.6 ${W-.3} C1.7775 ${W-.3} .3 ${W-1.7775} .3 ${W-3.6} L.3 3.6 C.3 1.7775 1.7775 .3 3.6 .3 Z`;
 const bodyPlan=plane(planD,q=>pp(q[0],q[1],bt));
 let under='';const axles=[11,L-12.5];
 // One authored outer contour, with analytic wheel-arch arcs. No Boolean
 // union is involved in this silhouette and no internal roof paths exist.
 const outlineCmds=[
  ['M',[r+R,I,H]],['L',[f-R,I,H]],
  ['C',[f-arc,I,H],[f+1.1,I-.3,H-2],[bf-1,.3,bt+1]],
  ['C',[bf,.3,bt],[bf+1.5,.3,bt],[bf+3,.3,bt]],
  ['L',[L-5.6,.3,bt]],
  ['C',[L-4.135,.3,bt],[L-2.81,.8925,bt],[L-1.85125,1.85125,bt]],
  ['L',[L-1.85125,1.85125,bl]],
  ['C',[L-.8925,2.81,bl],[L-.3,4.135,bl],[L-.3,5.6,bl]],
  ['L',[L-.3,W-5.6,bl]],
  ['C',[L-.3,W-2.67,bl],[L-2.67,W-.3,bl],[L-5.6,W-.3,bl]]
 ];
 const archR=5.55,archZ=4.75,theta=Math.asin((bl-archZ)/archR),arcExtent=Math.sqrt(archR*archR-(bl-archZ)*(bl-archZ));
 for(const u of [axles[1],axles[0]]){
  outlineCmds.push(['L',[u+arcExtent,W-.3,bl]]);
  const end=Math.PI-theta;
  for(const [a,b] of [[theta,Math.PI/2],[Math.PI/2,end]]){
   const k=4/3*Math.tan((b-a)/4),p=[u+archR*Math.cos(a),W-.3,archZ+archR*Math.sin(a)],q=[u+archR*Math.cos(b),W-.3,archZ+archR*Math.sin(b)];
   outlineCmds.push(['C',[p[0]-k*archR*Math.sin(a),W-.3,p[2]+k*archR*Math.cos(a)],[q[0]+k*archR*Math.sin(b),W-.3,q[2]-k*archR*Math.cos(b)],q]);
  }
 }
 outlineCmds.push(
  ['L',[3.6,W-.3,bl]],
  ['C',[1.7775,W-.3,bl],[.3,W-1.7775,bl+1],[.3,W-3.6,bl+2.8]],
  ['C',[.3,W-4.72,bl+3.9],[r-3.5,W-3.8,H-3.7],[r-1.8,W-4.2,H-2.2]],
  ['C',[r-.1,W-I-.3,H-.7],[r,W-I-arc,H],[r,W-I-R,H]],
  ['L',[r,I+R,H]],
  ['C',[r,I+arc,H],[r+arc,I,H],[r+R,I,H]]
 );
 const completeBody=d3(outlineCmds,pp,true);
 const shadow=plane(rr(1.5,1.5,L-2.5,W-1,5),q=>pp(q[0],q[1],-.4));
 under+=path('Ground / contact shadow',Geometry.topPath(shadow),'#9fa8b6',null,0,'opacity=".13"');
 for(const u of axles){const c=pp(u,W+.05,4.75),tr=`matrix(${F(dir*K)} .5 0 -1 ${F(c[0])} ${F(c[1])})`;
  under+=`<g id="Wheel / simple tire and rim" transform="${tr}"><circle r="5.1" fill="#98a1ac"/><circle r="3.55" fill="${COL.body}" stroke="${COL.edge}" stroke-opacity=".7" stroke-width=".38"/><circle r="1.45" fill="#98a1ac"/></g>`;
 }
 let detail='<defs><linearGradient id="side-shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#eff2f7"/><stop offset="1" stop-color="#e1e6ee"/></linearGradient></defs>';
 detail+=path('Body surface / uninterrupted soft side shading',Geometry.sidePath(bodyPlan,[0,bt-bl]),'url(#side-shade)');
 const glass=dark?COL.dark:COL.glass;
 // Glass is fill-only. No upper glass border doubled against the roof edge.
 detail+=path('Glazing / flowing side window',d3([
  ['M',[r+R+.25,W-I-.3,H-.85]],['L',[f-R-.25,W-I-.3,H-.85]],
  ['C',[f-arc,W-I-.3,H-.85],[f+.1,W-I-arc,H-1],[f+.55,W-I-R,H-1.3]],
  ['C',[f+2.8,W-I+1.4,H-4.5],[bf-2.1,W-.85,12],[bf-1.9,W-.85,11.45]],
  ['L',[br+3.8,W-.9,11.45]],
  ['C',[br+2.9,W-.9,12.4],[r+.5,W-I-.3,H-.85],[r+R+.25,W-I-.3,H-.85]]
 ],pp,true),glass);
 detail+=path('Glazing / one flowing windshield',d3([
  ['M',[f+.65,I+R+.25,H-1.5]],
  ['C',[f+.5,I+R+2.5,H-1.4],[f+.5,W-I-R-2.5,H-1.4],[f+.65,W-I-R-.25,H-1.5]],
  ['C',[f+3.3,W-I+.8,H-4],[bf-2.1,W-1.15,12],[bf-1.25,W-1.15,10.85]],
  ['C',[bf-.75,W-5.4,10.65],[bf-.75,5.4,10.65],[bf-1.25,1.15,10.85]],
  ['C',[bf-2.1,1.15,12],[f+3.3,I-.8,H-4],[f+.65,I+R+.25,H-1.5]]
 ],pp,true),glass);
 // One shared roof-to-cabin boundary, with no overlapping glass outline.
 detail+=path('Roof / single continuous shared boundary',d3([
  ['M',[r,W-I-R,H]],
  ['C',[r,W-I-arc,H],[r+arc,W-I,H],[r+R,W-I,H]],
  ['L',[f-R,W-I,H]],
  ['C',[f-arc,W-I,H],[f,W-I-arc,H],[f,W-I-R,H]],
  ['L',[f,I+R,H]],
  ['C',[f,I+arc,H],[f-arc,I,H],[f-R,I,H]]
 ],pp),'none',COL.edge,.44);
 const pillar=crossover?22:24;
 detail+=path('Cabin / clean B pillar',d3([['M',[pillar,W-.9,11.45]],['L',[pillar-.6,W-I-.3,H-.85]]],pp),'none',COL.body,1.05);
 // A single hood shoulder edge, smoothly tangent around both nose corners.
 detail+=path('Body seam / single hood and nose edge',d3([
  ['M',[bf-.15,W-.3,bt]],['L',[L-5.6,W-.3,bt]],
  ['C',[L-2.67,W-.3,bt],[L-.3,W-2.67,bt],[L-.3,W-5.6,bt]],
  ['L',[L-.3,5.6,bt]],
  ['C',[L-.3,4.135,bt],[L-.8925,2.81,bt],[L-1.85125,1.85125,bt]]
 ],pp),'none',COL.edge,.45);
 for(const u of [pillar,bf-1.7])detail+=path('Door seam / short structural joint',d3([['M',[u,W-.2,10.15]],['L',[u,W-.2,5.25]]],pp),'none',COL.edge,.35);
 for(const u of [crossover?15.5:17,34])detail+=path('Door / flush handle',d3([['M',[u,W-.05,9.35]],['L',[u+2.6,W-.05,9.35]]],pp),'none',COL.edge,.47);
 const front=q=>pp(L-.27,q[0],q[1]);
 for(const t of [5.7,W-10.5])detail+=path('Front / slim headlamp',Geometry.topPath(plane(rr(t,8,4.8,1.15,.5),front)),COL.body,COL.edge,.4);
 detail+=path('Front / small lower intake',Geometry.topPath(plane(rr(W/2-3.6,5.5,7.2,1.15,.5),front)),'#bfc6ce',COL.edge,.32);
 // One continuous mirror housing; no separate stem / circle intersections.
 const mirror=path('Mirror / integrated smooth housing',d3([
  ['M',[bf-4.4,W-.1,11.4]],
  ['C',[bf-5,W+1.2,12.4],[bf-2.7,W+1.8,12.5],[bf-2.3,W+.7,11.5]],
  ['C',[bf-2.2,W+.15,10.9],[bf-3.4,W-.1,10.9],[bf-4.4,W-.1,11.4]]
 ],pp,true),COL.body,COL.edge,.4);
 return {size:[w,h],body:svg(path('Body / single authored outer contour',completeBody,COL.body),w,h),under:svg(under,w,h),detail:svg(detail,w,h),mirror:svg(mirror,w,h),concept:crossover?'Compact crossover':'Smooth fastback',axis:[K,.5],height:H};
}

 const specs={
 A:{w:83,h:65,ox:55,oy:22,L:61,W:27,H:20.3,dir:-1,crossover:true,dark:true},
 B:{w:80,h:61,ox:54,oy:19,L:59,W:25,H:17.8,dir:-1,crossover:false,dark:false},
 C:{w:87,h:68,ox:30,oy:22,L:62,W:28,H:20.7,dir:1,crossover:true,dark:false},
 D:{w:81,h:61,ox:25,oy:20,L:56,W:26,H:17.8,dir:1,crossover:false,dark:true}
 };
 const cars={};
 const inner=s=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
 for(const [key,spec] of Object.entries(specs)){
  const car=design({...spec,...(options.vehicles?.[key]||{})});
  const body=inner(car.body);
  const outline=body.replace('fill="#f8f9fd"','fill="none" stroke="#747a80" stroke-opacity=".84" stroke-width=".58" stroke-linecap="round" stroke-linejoin="round"');
  car.svg=svg(inner(car.under)+body+'<defs><clipPath id="body-clip-'+key+'">'+body+'</clipPath></defs><g clip-path="url(#body-clip-'+key+')">'+inner(car.detail)+'</g>'+outline+inner(car.mirror),...car.size);
  cars[key]=car;
 }
 return cars;
}
if(typeof module!=='undefined'&&module.exports)module.exports=createIsometricVehicleAssets;
