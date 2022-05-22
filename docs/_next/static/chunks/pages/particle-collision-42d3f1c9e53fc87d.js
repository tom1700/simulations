(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[285],{2705:function(n,t,e){var i=e(5639).Symbol;n.exports=i},4239:function(n,t,e){var i=e(2705),r=e(9607),o=e(2333),a=i?i.toStringTag:void 0;n.exports=function(n){return null==n?void 0===n?"[object Undefined]":"[object Null]":a&&a in Object(n)?r(n):o(n)}},7561:function(n,t,e){var i=e(7990),r=/^\s+/;n.exports=function(n){return n?n.slice(0,i(n)+1).replace(r,""):n}},1957:function(n,t,e){var i="object"==typeof e.g&&e.g&&e.g.Object===Object&&e.g;n.exports=i},9607:function(n,t,e){var i=e(2705),r=Object.prototype,o=r.hasOwnProperty,a=r.toString,s=i?i.toStringTag:void 0;n.exports=function(n){var t=o.call(n,s),e=n[s];try{n[s]=void 0;var i=!0}catch(c){}var r=a.call(n);return i&&(t?n[s]=e:delete n[s]),r}},2333:function(n){var t=Object.prototype.toString;n.exports=function(n){return t.call(n)}},5639:function(n,t,e){var i=e(1957),r="object"==typeof self&&self&&self.Object===Object&&self,o=i||r||Function("return this")();n.exports=o},7990:function(n){var t=/\s/;n.exports=function(n){for(var e=n.length;e--&&t.test(n.charAt(e)););return e}},3279:function(n,t,e){var i=e(3218),r=e(7771),o=e(4841),a=Math.max,s=Math.min;n.exports=function(n,t,e){var c,u,l,f,d,p,v=0,h=!1,m=!1,w=!0;if("function"!=typeof n)throw new TypeError("Expected a function");function x(t){var e=c,i=u;return c=u=void 0,v=t,f=n.apply(i,e)}function y(n){return v=n,d=setTimeout(g,t),h?x(n):f}function b(n){var e=n-p;return void 0===p||e>=t||e<0||m&&n-v>=l}function g(){var n=r();if(b(n))return j(n);d=setTimeout(g,function(n){var e=t-(n-p);return m?s(e,l-(n-v)):e}(n))}function j(n){return d=void 0,w&&c?x(n):(c=u=void 0,f)}function S(){var n=r(),e=b(n);if(c=arguments,u=this,p=n,e){if(void 0===d)return y(p);if(m)return clearTimeout(d),d=setTimeout(g,t),x(p)}return void 0===d&&(d=setTimeout(g,t)),f}return t=o(t)||0,i(e)&&(h=!!e.leading,l=(m="maxWait"in e)?a(o(e.maxWait)||0,t):l,w="trailing"in e?!!e.trailing:w),S.cancel=function(){void 0!==d&&clearTimeout(d),v=0,c=p=u=d=void 0},S.flush=function(){return void 0===d?f:j(r())},S}},3218:function(n){n.exports=function(n){var t=typeof n;return null!=n&&("object"==t||"function"==t)}},7005:function(n){n.exports=function(n){return null!=n&&"object"==typeof n}},3448:function(n,t,e){var i=e(4239),r=e(7005);n.exports=function(n){return"symbol"==typeof n||r(n)&&"[object Symbol]"==i(n)}},7771:function(n,t,e){var i=e(5639);n.exports=function(){return i.Date.now()}},3493:function(n,t,e){var i=e(3279),r=e(3218);n.exports=function(n,t,e){var o=!0,a=!0;if("function"!=typeof n)throw new TypeError("Expected a function");return r(e)&&(o="leading"in e?!!e.leading:o,a="trailing"in e?!!e.trailing:a),i(n,t,{leading:o,maxWait:t,trailing:a})}},4841:function(n,t,e){var i=e(7561),r=e(3218),o=e(3448),a=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,c=/^0o[0-7]+$/i,u=parseInt;n.exports=function(n){if("number"==typeof n)return n;if(o(n))return NaN;if(r(n)){var t="function"==typeof n.valueOf?n.valueOf():n;n=r(t)?t+"":t}if("string"!=typeof n)return 0===n?n:+n;n=i(n);var e=s.test(n);return e||c.test(n)?u(n.slice(2),e?2:8):a.test(n)?NaN:+n}},997:function(n,t,e){(window.__NEXT_P=window.__NEXT_P||[]).push(["/particle-collision",function(){return e(4920)}])},8861:function(n,t,e){"use strict";e.d(t,{T:function(){return d}});var i=e(5893),r=e(7948),o=e(5861),a=e(9008),s=e.n(a),c=e(6447),u=e(1664),l=e.n(u),f=function(n){var t=n.backLink,e=n.backLabel,r=n.forwardLink,o=n.forwardLabel;return(0,i.jsxs)(c.Z,{spacing:2,direction:"row",style:{justifyContent:"space-between",padding:"0.5rem 0",marginBottom:"0.5rem",borderBottom:"solid 1px #AAA"},children:[t&&(0,i.jsx)(l(),{href:t,children:e}),r&&(0,i.jsx)(l(),{href:r,children:o})]})},d=function(n){var t=n.title,e=n.subtitle,a=n.backLink,c=n.backLabel,u=n.forwardLink,l=n.forwardLabel,d=n.children;return(0,i.jsxs)(r.Z,{maxWidth:"lg",style:{minHeight:"100vh",display:"flex",flexDirection:"column"},children:[(0,i.jsxs)(s(),{children:[(0,i.jsx)("title",{children:"Simulations"}),(0,i.jsx)("meta",{name:"description",content:t}),(0,i.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,i.jsx)(f,{backLink:a,backLabel:c,forwardLink:u,forwardLabel:l}),(0,i.jsx)(o.Z,{variant:"h3",component:"h1",children:t}),e&&(0,i.jsx)(o.Z,{variant:"subtitle1",children:e}),d]})}},4920:function(n,t,e){"use strict";e.r(t);var i=e(5893),r=e(6447),o=e(7507),a=e(3321),s=e(7294),c=e(1125),u=e(9477),l=e(7995),f=e(3255),d=e(8861),p=e(3493),v=e.n(p);var h=function(){function n(t,e,i){!function(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),this.shouldStop=!1,this.worldSize=t,this.particlesAmount=e,this.onFPSUpdate=i}var t=n.prototype;return t.startAnimation=function(n){var t=this,e=function(n,t){var e=new c.World;e.gravity.set(0,-9.82,0);var i=new Array(t).fill(0).map((function(){var n=new c.Body({mass:1,position:new c.Vec3((0,f.i)(-5,5),(0,f.i)(-5,5),(0,f.i)(-5,5)),shape:new c.Sphere(1)});return e.addBody(n),n})),r=new c.Material("stone"),o=new c.Plane,a=new c.Body({mass:0,material:r});a.addShape(o),a.quaternion.setFromAxisAngle(new c.Vec3(1,0,0),-Math.PI/2),a.position.set(0,-n/2,0),e.addBody(a);var s=new c.Plane,u=new c.Body({mass:0,material:r});u.addShape(s),u.quaternion.setFromAxisAngle(new c.Vec3(1,0,0),Math.PI/2),u.position.set(0,n/2,0),e.addBody(u);var l=new c.Plane,d=new c.Body({mass:0,material:r});d.addShape(l),d.quaternion.setFromAxisAngle(new c.Vec3(0,1,0),Math.PI/2),d.position.set(-n/2,0,0),e.addBody(d);var p=new c.Plane,v=new c.Body({mass:0,material:r});v.addShape(p),v.quaternion.setFromAxisAngle(new c.Vec3(0,1,0),-Math.PI/2),v.position.set(n/2,0,0),e.addBody(v);var h=new c.Plane,m=new c.Body({mass:0,material:r});m.addShape(h),m.position.set(0,0,-n/2),e.addBody(m);var w=new c.Plane,x=new c.Body({mass:0,material:r});return x.addShape(w),x.quaternion.setFromAxisAngle(new c.Vec3(0,1,0),Math.PI),x.position.set(0,0,n/2),e.addBody(x),{world:e,particles:i}}(this.worldSize,this.particlesAmount),i=e.world,r=e.particles,o=(0,l.Y)(n,this.worldSize),a=o.scene,s=o.render,d=o.removeScene,p=r.map((function(n){var t=new u.xo$(1),e=new u.vBJ({color:16711680}),i=new u.Kj0(t,e);return i.position.set(n.position.x,n.position.y,n.position.z),a.add(i),{sphere:i,particle:n}})),v=Date.now(),h=function(){if(t.shouldStop)d();else{var n=Date.now();t.onFPSUpdate(1e3/(n-v)),v=n,requestAnimationFrame(h),i.step(.016666666666666666),p.forEach((function(n){var t,e,i=n.sphere;e=n.particle,(t=i).position.x=e.position.x,t.position.y=e.position.y,t.position.z=e.position.z,t.quaternion.x=e.quaternion.x,t.quaternion.y=e.quaternion.y,t.quaternion.z=e.quaternion.z,t.quaternion.w=e.quaternion.w})),s()}};h()},t.stopAnimation=function(){this.shouldStop=!0},n}();t.default=function(){var n=(0,s.useRef)(),t=(0,s.useRef)(null),e=(0,s.useRef)(null),c=(0,s.useState)(10),u=c[0],l=c[1],f=(0,s.useState)(10),p=f[0],m=f[1],w=(0,s.useCallback)((function(){if(n.current&&n.current.stopAnimation(),t.current){n.current=new h(u,p,v()((function(n){e.current&&(e.current.innerText=n.toFixed(0))}),1e3)),n.current.startAnimation(t.current)}}),[p,u]);return(0,i.jsx)(d.T,{title:"Particle simulation with collisions",subtitle:"This time I'm using cannon.js for a proper physics simulation",backLink:"/particle-gravity",backLabel:"< Particle Gravity",forwardLink:"/particle-collision-with-worker",forwardLabel:"Particle Collision Web Worker >",children:(0,i.jsxs)(r.Z,{spacing:2,direction:"row",style:{flex:1},children:[(0,i.jsx)("div",{style:{flex:2},ref:t}),(0,i.jsxs)(r.Z,{spacing:2,style:{flex:1},children:["World Size: ",u,(0,i.jsx)(o.ZP,{min:10,max:100,step:1,value:u,onChange:function(n,t){return!Array.isArray(t)&&l(t)}}),"Particles Amount: ",p,(0,i.jsx)(o.ZP,{min:10,max:2e3,step:1,value:p,onChange:function(n,t){return!Array.isArray(t)&&m(t)}}),(0,i.jsxs)("div",{children:["FPS: ",(0,i.jsx)("span",{ref:e,children:"0"})]}),(0,i.jsx)(a.Z,{onClick:w,children:"Simulate"})]})]})})}},7995:function(n,t,e){"use strict";e.d(t,{Y:function(){return o}});var i=e(9477),r=e(9365),o=function(n,t){var e=n.clientWidth,o=n.clientHeight,a=new i.xsS,s=new i.cPb(75,e/o,.1,1e3);s.position.z=3*t;var c=new i.Mig(8421504);a.add(c);var u=new i.Ox3(16777215,1);u.position.x=s.position.x,u.position.y=s.position.y,u.position.z=s.position.z,a.add(u),new r.z(s,n);var l=new i.CP7;l.setSize(e,o),n.appendChild(l.domElement);return{scene:a,removeScene:function(){n.removeChild(l.domElement)},render:function(){l.render(a,s)}}}},3255:function(n,t,e){"use strict";e.d(t,{i:function(){return i}});var i=function(n,t){return Math.random()*(t-n)+n}}},function(n){n.O(0,[737,526,543,321,507,365,774,888,179],(function(){return t=997,n(n.s=t);var t}));var t=n.O();_N_E=t}]);