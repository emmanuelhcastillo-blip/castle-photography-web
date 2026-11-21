/**
 * CASTLE / Real volumetric WebGL smartphone.
 * Procedural beveled mesh, metal frame, front glass, rear camera barrels and
 * a LIVE CanvasTexture. Screen content is a clearly labeled in-house concept,
 * not a screenshot of a real client campaign and does not contain fake metrics.
 * Three.js v0.169 pinned for stable browser behaviour. Falls back to HTML/CSS.
 */
(async () => {
  'use strict';
  const holder = document.getElementById('immersive-phone');
  const canvas = document.getElementById('castle-phone-canvas');
  if (!holder || !canvas) return;
  const fallback = document.getElementById('phoneFallback');
  const stage = holder;
  let THREE;
  try {
    THREE = await import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js');
  } catch (error) {
    stage.dataset.renderStatus = '3d-library-unavailable';
    console.info('CASTLE: Three.js indisponível; versão leve ativada.');
    return;
  }
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.65));
    renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
  } catch (error) {
    stage.dataset.renderStatus = 'webgl-unavailable';
    console.info('CASTLE: WebGL indisponível; versão leve ativada.');
    return;
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36,1,0.1,80);
  camera.position.set(0,0,11.5);
  scene.add(new THREE.AmbientLight(0xffffff,1.6));
  const key = new THREE.DirectionalLight(0xffd9a6,3.2);key.position.set(-4,6,9);scene.add(key);
  const rim = new THREE.PointLight(0x83dfff,45,16);rim.position.set(5,3,-1);scene.add(rim);
  const warm = new THREE.PointLight(0xffa571,30,15);warm.position.set(-4,-3,5);scene.add(warm);
  const blue = new THREE.PointLight(0x4289d9,12,12);blue.position.set(4,-4,-5);scene.add(blue);

  const rig = new THREE.Group();scene.add(rig);
  const phone = new THREE.Group();rig.add(phone);
  const metal = new THREE.MeshStandardMaterial({color:0x27323d,metalness:.95,roughness:.16});
  const darkMetal = new THREE.MeshStandardMaterial({color:0x0e141e,metalness:.8,roughness:.23});
  const gold = new THREE.MeshStandardMaterial({color:0xd3a360,metalness:.82,roughness:.25});
  const glass = new THREE.MeshPhysicalMaterial({color:0x151d26,metalness:.2,roughness:.1,clearcoat:1,clearcoatRoughness:.02,side:THREE.DoubleSide});
  const screenBorder = new THREE.MeshStandardMaterial({color:0x070b10,metalness:.5,roughness:.32,side:THREE.DoubleSide});

  function roundedShape(w,h,r){
    const x=-w/2,y=-h/2,s=new THREE.Shape();
    s.moveTo(x+r,y);
    s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
    s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
    s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
    return s;
  }
  function flatShape(w,h,r){const g=new THREE.ShapeGeometry(roundedShape(w,h,r),20);
    const pos=g.getAttribute('position'),uv=g.getAttribute('uv');
    for(let i=0;i<pos.count;i++)uv.setXY(i,pos.getX(i)/w+.5,pos.getY(i)/h+.5);
    return g;
  }
  const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(2.60,5.32,.33),{
    depth:.24,bevelEnabled:true,bevelThickness:.065,bevelSize:.06,bevelSegments:5,curveSegments:18,steps:1
  }),metal);
  frame.position.z=-.12;phone.add(frame);
  const edgeGold = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(2.57,5.29,.31),{
    depth:.02,bevelEnabled:false,steps:1,curveSegments:18
  }),gold);
  edgeGold.position.z=.19;phone.add(edgeGold);
  const bezel = new THREE.Mesh(flatShape(2.52,5.22,.30),screenBorder);
  bezel.position.z=.218;phone.add(bezel);
  const casingBack = new THREE.Mesh(flatShape(2.50,5.23,.30),new THREE.MeshStandardMaterial({color:0x273c43,metalness:.65,roughness:.28,side:THREE.DoubleSide}));
  casingBack.rotation.y=Math.PI;casingBack.position.z=-.19;phone.add(casingBack);
  const thinStripe = new THREE.Mesh(new THREE.BoxGeometry(.045,4.5,.023),gold);
  thinStripe.position.set(-1.31,0,.05);phone.add(thinStripe);
  const upperButton = new THREE.Mesh(new THREE.BoxGeometry(.04,.68,.10),gold);
  upperButton.position.set(-1.344,1.13,.01);phone.add(upperButton);
  const lowerButton = upperButton.clone();lowerButton.position.y=.28;lowerButton.scale.y=.55;phone.add(lowerButton);
  const rightButton = upperButton.clone();rightButton.position.x=1.344;rightButton.position.y=.45;rightButton.scale.y=.8;phone.add(rightButton);

  // Device camera island and individually modeled glass lenses, visible on back rotation.
  const island = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(1.12,1.28,.22),{
    depth:.08,bevelEnabled:true,bevelThickness:.05,bevelSize:.045,bevelSegments:3,curveSegments:16
  }),darkMetal);
  island.position.set(-.58,1.73,-.30);island.rotation.y=Math.PI;phone.add(island);
  const lensPositions=[[-.84,2.03],[-.30,1.76],[-.84,1.47]];
  for(const [x,y] of lensPositions){
    for(const [radius,depth,mat] of [
      [.275,-.425,gold],[.23,-.452,darkMetal],[.165,-.475,new THREE.MeshPhysicalMaterial({color:0x061b32,metalness:.7,roughness:.04,clearcoat:1})]
    ]){
      const t=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,.03,32),mat);t.rotation.x=Math.PI/2;t.position.set(x,y,depth);phone.add(t);
    }
    const glint=new THREE.Mesh(new THREE.CircleGeometry(.034,18),new THREE.MeshBasicMaterial({color:0x8acef4,transparent:true,opacity:.5}));
    glint.position.set(x-.055,y+.055,-.50);glint.rotation.y=Math.PI;phone.add(glint);
  }
  const flash=new THREE.Mesh(new THREE.CircleGeometry(.068,18),new THREE.MeshBasicMaterial({color:0xf7dfb2}));
  flash.position.set(-.31,2.16,-.419);flash.rotation.y=Math.PI;phone.add(flash);
  const logoCanvas=document.createElement('canvas');logoCanvas.width=512;logoCanvas.height=512;
  const l=logoCanvas.getContext('2d');l.clearRect(0,0,512,512);l.textAlign='center';l.fillStyle='#ecdfc5';l.font='bold 87px Arial';l.fillText('CASTLE',256,275);l.font='22px Arial';l.letterSpacing='7px';l.fillText('CREATIVE STUDIO',256,317);
  const logoTex=new THREE.CanvasTexture(logoCanvas);logoTex.colorSpace=THREE.SRGBColorSpace;
  const logoMesh=new THREE.Mesh(new THREE.PlaneGeometry(2.20,2.0),new THREE.MeshBasicMaterial({map:logoTex,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
  logoMesh.rotation.y=Math.PI;logoMesh.position.set(0,-.6,-.249);phone.add(logoMesh);

  // LIVE screen: creative scenes drawn on every frame of a real canvas texture.
  const screen=document.createElement('canvas');screen.width=720;screen.height=1440;
  const ctx=screen.getContext('2d',{alpha:false});
  const texture=new THREE.CanvasTexture(screen);texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  const display=new THREE.Mesh(flatShape(2.38,5.08,.24),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
  display.position.z=.231;phone.add(display);
  const notch=new THREE.Mesh(flatShape(.80,.125,.06),screenBorder);notch.position.set(0,2.45,.244);phone.add(notch);
  const homebar=new THREE.Mesh(flatShape(.68,.035,.02),new THREE.MeshBasicMaterial({color:0xf4f0ea,transparent:true,opacity:.9}));homebar.position.set(0,-2.43,.245);phone.add(homebar);
  const ringMaterial=new THREE.MeshBasicMaterial({color:0xf0c482,transparent:true,opacity:.33});
  const torus=new THREE.Mesh(new THREE.TorusGeometry(3.28,.012,12,240),ringMaterial);torus.rotation.set(.38,.25,.1);rig.add(torus);
  const torus2=new THREE.Mesh(new THREE.TorusGeometry(2.6,.008,10,220),new THREE.MeshBasicMaterial({color:0x7fcddb,transparent:true,opacity:.20}));torus2.rotation.set(.62,-.28,.3);rig.add(torus2);

  let imageReady=false,portrait=null;
  const ownPhoto=new Image();ownPhoto.crossOrigin='anonymous';
  ownPhoto.onload=()=>{portrait=ownPhoto;imageReady=true;};
  ownPhoto.onerror=()=>{portrait=null;imageReady=false;};
  ownPhoto.src='../foto-oculos.jpg';

  let sceneIndex=0,lastTex=0,screenTime=0,paused=false,userDrag=false,targetYaw=-.43,yaw=-.43,pitch=.11,targetPitch=.11;
  let downX=0,downY=0,prevX=0,prevY=0,dragged=false,lastFrame=0,visible=true;
  const shots=['REEL / HOOK','UGC / CÂMERA','ANÚNCIO / MOTION'];
  function rr(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  function t(text,x,y,size=28,color='#fff',weight=700,align='left'){ctx.fillStyle=color;ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.textAlign=align;ctx.fillText(text,x,y);ctx.textAlign='left';}
  function fillGrad(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y+w*.16,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(x,y,w,h);}
  function base(u){
    ctx.fillStyle='#081019';ctx.fillRect(0,0,720,1440);
    fillGrad(0,0,720,1440,'#14202c','#090d15');
    t('10:24',42,49,23,'#e8ecec',700);t('●●  ▰',650,49,22,'#e8ecec',700,'right');
    t('CASTLE',44,129,42,'#f6dfb5',800);t(' / EDIT LAB',245,127,21,'#92b2b8',600);
    rr(36,152,648,2,1,'#46616d');
    t('PROJECT 01',43,193,19,'#87b2be',800);t(shots[sceneIndex],673,193,19,'#e6b969',800,'right');
    t('DEMO / CONCEITO',44,1379,18,'#7d9ba8',700);
  }
  function drawPreviewClip(u){
    ctx.save();ctx.beginPath();ctx.roundRect(35,225,650,750,35);ctx.clip();
    if(sceneIndex===0){
      fillGrad(35,225,650,750,'#26465a','#0e1b26');
      const centerX=450+Math.sin(u*.9)*25,centerY=525+Math.cos(u*.6)*16;
      const g=ctx.createRadialGradient(centerX-90,centerY-90,10,centerX,centerY,410);g.addColorStop(0,'#f3c579');g.addColorStop(.35,'#d97c77');g.addColorStop(1,'#602d71');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(centerX,centerY,245,305,-.3,0,Math.PI*2);ctx.fill();
      ctx.save();ctx.translate(centerX,centerY);ctx.rotate(u*.23);for(let j=0;j<10;j++){ctx.strokeStyle=`rgba(255,225,190,${.19-j*.013})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,185+j*24,220+j*24,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
      t('O SEU VÍDEO',69,490,64,'#fff9ee',900);t('NÃO PRECISA',69,570,61,'#fff9ee',900);rr(67,591,550,95,9,'#f4bd68');t('SER INVISÍVEL.',82,656,62,'#17222b',900);
      t('O gancho é só o começo.',71,744,31,'#ebeced',500);
    }else if(sceneIndex===1){
      fillGrad(35,225,650,750,'#344e5a','#1c2938');
      if(portrait){const iw=portrait.width,ih=portrait.height,aspect=650/750;let sx=0,sy=0,sw=iw,sh=ih;if(iw/ih>aspect){sw=ih*aspect;sx=(iw-sw)/2;}else{sh=iw/aspect;sy=(ih-sh)/2;}ctx.drawImage(portrait,sx,sy,sw,sh,35,225,650,750);}
      else{const g=ctx.createLinearGradient(35,225,685,975);g.addColorStop(0,'#e5aa79');g.addColorStop(1,'#6c345c');ctx.fillStyle=g;ctx.fillRect(35,225,650,750);}
      const overlay=ctx.createLinearGradient(0,445,0,975);overlay.addColorStop(0,'#0000');overlay.addColorStop(1,'#091019e6');ctx.fillStyle=overlay;ctx.fillRect(35,445,650,530);
      rr(63,271,340,42,22,'#0c1327a8');t('UGC • ROTEIRO ORIGINAL',82,299,19,'#ffdbab',800);
      t('VOCÊ FALA.',63,736,78,'#fff',900);t('A HISTÓRIA',63,814,70,'#fff',900);rr(61,828,528,77,7,'#edbe79');t('PRENDE.',79,884,73,'#10161b',900);
    }else{
      fillGrad(35,225,650,750,'#422b49','#1b2333');
      const o=ctx.createRadialGradient(385,488,30,385,488,345);o.addColorStop(0,'#ffdbb2');o.addColorStop(.3,'#f5a679');o.addColorStop(.7,'#b267ae');o.addColorStop(1,'#381d54');ctx.fillStyle=o;ctx.beginPath();ctx.ellipse(390,527,220,300,.25,0,Math.PI*2);ctx.fill();
      for(let i=0;i<16;i++){ctx.strokeStyle='#fff4';ctx.lineWidth=2;const yy=290+i*34+Math.sin(u+i)*12;ctx.beginPath();ctx.moveTo(50,yy);ctx.lineTo(640,yy+Math.sin(u*1.3+i)*18);ctx.stroke();}
      rr(70,280,214,39,18,'#ffe3ac');t('AD / CONCEITO',85,307,18,'#24212e',800);
      t('DA IDEIA',62,731,100,'#fffaf0',900);t('AO ANÚNCIO.',62,839,81,'#fffaf0',900);
      rr(64,867,475,60,4,'#fbcc78');t('IMAGEM + MOVIMENTO',78,908,28,'#261e2b',800);
    }
    ctx.restore();
    rr(62,931,590,3,1,'#fff4');rr(62,931,Math.max(9,(u%15)/15*590),3,1,'#f3c777');
    rr(54,1012,80,30,8,'#f2c275');t('▶',75,1035,20,'#16202c',800);t(`00:${String(Math.floor(u%15)).padStart(2,'0')} / 00:15`,167,1033,23,'#d6e2e2',600);
  }
  function drawTimeline(u){
    rr(34,1071,652,247,21,'#101d28');
    t('TIMELINE',55,1107,18,'#9cb6c2',800);t('15 SEC',655,1107,18,'#9cb6c2',800,'right');
    const ticks=[0,5,10,15];ticks.forEach((v,i)=>t(`00:${String(v).padStart(2,'0')}`,73+i*185,1143,17,'#708c9b',500));
    for(let i=0;i<13;i++)rr(64+i*46,1155,42,45,4,i%3===0?'#94789e':i%2?'#447583':'#836950');
    rr(65,1210,563,29,4,'#6550a0');t('T   TEXTO / MOTION GRAPHICS',80,1231,17,'#f8efff',700);
    rr(65,1248,563,32,4,'#1f6665');
    for(let i=0;i<65;i++){const h=7+Math.abs(Math.sin(i*.73+u*1.8)*17+Math.sin(i*1.77)*5);rr(69+i*8.55,1264-h/2,4,h,2,'#79e2cc');}
    const x=65+(u%15)/15*563;rr(x,1150,3,137,1,'#fff');
  }
  function drawUI(u){base(u);drawPreviewClip(u);drawTimeline(u);}
  function nextScene(){sceneIndex=(sceneIndex+1)%3;screenTime=0;drawUI(screenTime);texture.needsUpdate=true;holder.dataset.scene=String(sceneIndex);}
  document.getElementById('nextPhoneScene')?.addEventListener('click',nextScene);
  const rotButton=document.getElementById('rotatePhone'),rotLabel=document.getElementById('rotateLabel'),rotIcon=document.getElementById('rotateIcon');
  rotButton?.addEventListener('click',()=>{paused=!paused;rotButton.setAttribute('aria-pressed',String(paused));if(rotLabel)rotLabel.textContent=paused?'Retomar giro':'Pausar giro';if(rotIcon)rotIcon.textContent=paused?'▶':'Ⅱ';});
  canvas.addEventListener('pointerdown',e=>{userDrag=true;dragged=false;downX=prevX=e.clientX;downY=prevY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!userDrag)return;const dx=e.clientX-prevX,dy=e.clientY-prevY;if(Math.abs(e.clientX-downX)>7)dragged=true;targetYaw+=dx*.009;targetPitch=Math.max(-.38,Math.min(.38,targetPitch+dy*.003));prevX=e.clientX;prevY=e.clientY;if(dragged&&Math.abs(e.clientX-downX)>Math.abs(e.clientY-downY))e.preventDefault();});
  const release=()=>{userDrag=false;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){targetYaw+=(e.key==='ArrowLeft'?-1:1)*.25;e.preventDefault();}});
  canvas.tabIndex=0;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function resize(){const rect=canvas.getBoundingClientRect();const w=Math.max(1,Math.round(rect.width)),h=Math.max(1,Math.round(rect.height));if(w<5||h<5)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=w<460?12.8:w<720?11.7:10.65;camera.fov=w<470?40:36;camera.updateProjectionMatrix();}
  let resizeObs=null;if('ResizeObserver' in window){resizeObs=new ResizeObserver(resize);resizeObs.observe(canvas);}else window.addEventListener('resize',resize);resize();
  if('IntersectionObserver' in window){const obs=new IntersectionObserver(([e])=>{visible=!!e?.isIntersecting},{threshold:.05});obs.observe(canvas);}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)lastFrame=0;});
  const clock=new THREE.Clock();let disposed=false;
  function animate(now){if(disposed)return;requestAnimationFrame(animate);if(document.hidden||!visible)return;if(now-lastFrame<34)return;
    let dt=clock.getDelta();dt=Math.min(.08,Math.max(0,dt));lastFrame=now;
    if(!paused&&!userDrag&&!reduced.matches){targetYaw+=dt*.34;}
    if(!reduced.matches)screenTime+=dt;
    if(screenTime>15){sceneIndex=(sceneIndex+1)%3;screenTime=0;holder.dataset.scene=String(sceneIndex);}
    yaw+=(targetYaw-yaw)*Math.min(1,dt*7);pitch+=(targetPitch-pitch)*Math.min(1,dt*7);
    phone.rotation.set(pitch,yaw,.065*Math.sin(now*.0007));
    phone.position.y=.08*Math.sin(now*.001);
    torus.rotation.z+=dt*.045;torus2.rotation.z-=dt*.026;
    if(now-lastTex>65){drawUI(screenTime);texture.needsUpdate=true;lastTex=now;}
    renderer.render(scene,camera);
  }
  drawUI(0);texture.needsUpdate=true;resize();renderer.render(scene,camera);
  stage.classList.add('is-webgl');stage.dataset.renderStatus='webgl-threejs';canvas.dataset.renderStatus='webgl-threejs';
  window.castlePhone3d={get status(){return stage.dataset.renderStatus;},nextScene,stop:()=>{disposed=true;renderer.dispose();resizeObs?.disconnect();}};
  requestAnimationFrame(animate);
})();
