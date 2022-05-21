(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[285],{997:function(n,e,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/particle-collision",function(){return i(4920)}])},4920:function(n,e,i){"use strict";i.r(e);var t=i(5893),o=i(9008),r=i.n(o),a=i(7948),s=i(5861),l=i(6447),c=i(7507),d=i(3321),u=i(7294),p=i(1664),h=i.n(p),f=i(1125),m=i(9477),w=i(7995),x=i(3255);var v=function(){function n(e,i,t){!function(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),this.shouldStop=!1,this.worldSize=e,this.particlesAmount=i,this.onFPSUpdate=t}var e=n.prototype;return e.startAnimation=function(n){var e=this,i=function(n,e){var i=new f.World;i.gravity.set(0,-9.82,0);var t=new Array(e).fill(0).map((function(){var n=new f.Body({mass:1,position:new f.Vec3((0,x.i)(-5,5),(0,x.i)(-5,5),(0,x.i)(-5,5)),shape:new f.Sphere(1)});return i.addBody(n),n})),o=new f.Material("stone"),r=new f.Plane,a=new f.Body({mass:0,material:o});a.addShape(r),a.quaternion.setFromAxisAngle(new f.Vec3(1,0,0),-Math.PI/2),a.position.set(0,-n/2,0),i.addBody(a);var s=new f.Plane,l=new f.Body({mass:0,material:o});l.addShape(s),l.quaternion.setFromAxisAngle(new f.Vec3(1,0,0),Math.PI/2),l.position.set(0,n/2,0),i.addBody(l);var c=new f.Plane,d=new f.Body({mass:0,material:o});d.addShape(c),d.quaternion.setFromAxisAngle(new f.Vec3(0,1,0),Math.PI/2),d.position.set(-n/2,0,0),i.addBody(d);var u=new f.Plane,p=new f.Body({mass:0,material:o});p.addShape(u),p.quaternion.setFromAxisAngle(new f.Vec3(0,1,0),-Math.PI/2),p.position.set(n/2,0,0),i.addBody(p);var h=new f.Plane,m=new f.Body({mass:0,material:o});m.addShape(h),m.position.set(0,0,-n/2),i.addBody(m);var w=new f.Plane,v=new f.Body({mass:0,material:o});return v.addShape(w),v.quaternion.setFromAxisAngle(new f.Vec3(0,1,0),Math.PI),v.position.set(0,0,n/2),i.addBody(v),{world:i,particles:t}}(this.worldSize,this.particlesAmount),t=i.world,o=i.particles,r=(0,w.Y)(n,this.worldSize),a=r.scene,s=r.render,l=r.removeScene,c=o.map((function(n){var e=new m.xo$(1),i=new m.vBJ({color:16711680}),t=new m.Kj0(e,i);return t.position.set(n.position.x,n.position.y,n.position.z),a.add(t),{sphere:t,particle:n}})),d=Date.now(),u=function(){if(e.shouldStop)l();else{var n=Date.now();e.onFPSUpdate(1e3/(n-d)),d=n,requestAnimationFrame(u),t.step(.016666666666666666),c.forEach((function(n){var e,i,t=n.sphere;i=n.particle,(e=t).position.x=i.position.x,e.position.y=i.position.y,e.position.z=i.position.z,e.quaternion.x=i.quaternion.x,e.quaternion.y=i.quaternion.y,e.quaternion.z=i.quaternion.z,e.quaternion.w=i.quaternion.w})),s()}};u()},e.stopAnimation=function(){this.shouldStop=!0},n}();e.default=function(){var n=(0,u.useRef)(),e=(0,u.useRef)(null),i=(0,u.useRef)(null),o=(0,u.useState)(10),p=o[0],f=o[1],m=(0,u.useState)(10),w=m[0],x=m[1],y=(0,u.useCallback)((function(){n.current&&n.current.stopAnimation(),e.current&&(n.current=new v(p,w,(function(n){i.current&&(i.current.innerText=n.toFixed(0))})),n.current.startAnimation(e.current))}),[w,p]);return(0,t.jsxs)(a.Z,{maxWidth:"lg",style:{minHeight:"100vh",paddingTop:"1rem",display:"flex",flexDirection:"column"},children:[(0,t.jsxs)(r(),{children:[(0,t.jsx)("title",{children:"Simulations"}),(0,t.jsx)("meta",{name:"description",content:"Gravity simulation for a single particle"}),(0,t.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,t.jsx)(s.Z,{variant:"h3",component:"h1",children:"Gravity simulation for a single particle"}),(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,t.jsx)(h(),{href:"/particle-gravity",children:"< Optimize Mesh"}),(0,t.jsx)(h(),{href:"/particle-collision",children:"Particle Collision >"})]}),(0,t.jsxs)(l.Z,{spacing:2,direction:"row",style:{flex:1},children:[(0,t.jsx)("div",{style:{flex:2},ref:e}),(0,t.jsxs)(l.Z,{spacing:2,style:{flex:1},children:["World Size: ",p,(0,t.jsx)(c.ZP,{min:10,max:100,step:1,value:p,onChange:function(n,e){return!Array.isArray(e)&&f(e)}}),"Particles Amount: ",w,(0,t.jsx)(c.ZP,{min:10,max:2e3,step:1,value:w,onChange:function(n,e){return!Array.isArray(e)&&x(e)}}),(0,t.jsxs)("div",{children:["FPS: ",(0,t.jsx)("span",{ref:i,children:"0"})]}),(0,t.jsx)(d.Z,{onClick:y,children:"Simulate"})]})]})]})}},7995:function(n,e,i){"use strict";i.d(e,{Y:function(){return r}});var t=i(9477),o=i(9365),r=function(n,e){var i=n.clientWidth,r=n.clientHeight,a=new t.xsS,s=new t.cPb(75,i/r,.1,1e3);s.position.z=3*e;var l=new t.Mig(8421504);a.add(l);var c=new t.Ox3(16777215,1);c.position.x=s.position.x,c.position.y=s.position.y,c.position.z=s.position.z,a.add(c),new o.z(s,n);var d=new t.CP7;d.setSize(i,r),n.appendChild(d.domElement);return{scene:a,removeScene:function(){n.removeChild(d.domElement)},render:function(){d.render(a,s)}}}},3255:function(n,e,i){"use strict";i.d(e,{i:function(){return t}});var t=function(n,e){return Math.random()*(e-n)+n}}},function(n){n.O(0,[737,526,543,321,507,365,774,888,179],(function(){return e=997,n(n.s=e);var e}));var e=n.O();_N_E=e}]);