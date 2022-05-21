(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[304],{5494:function(t,i,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/particle-gravity",function(){return n(8841)}])},931:function(t,i,n){"use strict";n.d(i,{O:function(){return e}});var e=function(){function t(i,n,e){!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),this.x=i,this.y=n,this.z=e}var i=t.prototype;return i.getAbsoluteVector=function(){return new t(Math.abs(this.x),Math.abs(this.y),Math.abs(this.z))},i.getDirectionVector=function(){return new t(0===this.x?0:Math.abs(this.x)/this.x,0===this.y?0:Math.abs(this.y)/this.y,0===this.z?0:Math.abs(this.z)/this.z)},i.getLongest=function(){var t=this.getAbsoluteVector();return t.x>t.y&&t.x>t.z?"x":t.y>t.z&&t.y>t.x?"y":"z"},i.getLength=function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},i.getNormal=function(){var i=this.getLength();return new t(this.x/i,this.y/i,this.z/i)},i.multiply=function(i){return new t(this.x*i,this.y*i,this.z*i)},i.add=function(i){return new t(this.x+i.x,this.y+i.y,this.z+i.z)},i.subtract=function(i){return new t(this.x-i.x,this.y-i.y,this.z-i.z)},i.floor=function(){return new t(Math.floor(this.x),Math.floor(this.y),Math.floor(this.z))},i.ceil=function(){return new t(Math.ceil(this.x),Math.ceil(this.y),Math.ceil(this.z))},i.clone=function(){return new t(this.x,this.y,this.z)},i.addMutate=function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this},i.subtractMutate=function(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this},i.cloneFrom=function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this},i.multiplyMutate=function(t){return this.x*=t,this.y*=t,this.z*=t,this},i.floorMutate=function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this},i.scalarProduct=function(t){return this.x*t.x+this.y*t.y+this.z*t.z},i.toString=function(){return"{x:".concat(this.x,",y:").concat(this.y,",z:").concat(this.z,"}")},t}()},8841:function(t,i,n){"use strict";n.r(i),n.d(i,{default:function(){return _}});var e=n(5893),s=n(9008),o=n.n(s),r=n(7948),a=n(5861),u=n(6447),h=n(3321),c=n(7294),l=n(1664),f=n.n(l),d=n(7995),y=n(931),p=n(3255);function x(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function v(t,i){for(var n=0;n<i.length;n++){var e=i[n];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}var w=function(){function t(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;x(this,t),this._volume=0,this._mass=0,this._position=i,this._radius=n,this._hardness=e,this._density=s,this.updateVolumeAndMass()}var i,n,e,s=t.prototype;return s.updateVolumeAndMass=function(){this._volume=4/3*Math.PI*Math.pow(this.radius,3),this._mass=this._volume*this.density},s.setHardness=function(t){this._hardness=t},s.setDensity=function(t){this._density=t},i=t,(n=[{key:"position",get:function(){return this._position},set:function(t){this.position=t}},{key:"radius",get:function(){return this._radius},set:function(t){this.radius=t,this.updateVolumeAndMass()}},{key:"hardness",get:function(){return this._hardness}},{key:"density",get:function(){return this._density}},{key:"volume",get:function(){return this._volume}},{key:"mass",get:function(){return this._mass}}])&&v(i.prototype,n),e&&v(i,e),t}();var m=function(){function t(i,n){!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),this.gravityDirection=new y.O(0,-1,0),this.gravityForce=9.8,this.velocityIncrease=new y.O(0,0,0),this.newPosition=new y.O(0,0,0),this.particles=i.map((function(t){return{particle:t,velocity:new y.O(0,0,0)}})),this.worldSize=n}var i=t.prototype;return i.ensureWorldBounds=function(t,i){t.x<=i&&(t.x=i),t.x>=this.worldSize-i&&(t.x=this.worldSize-i),t.y<=i&&(t.y=i),t.y>=this.worldSize-i&&(t.y=this.worldSize-i),t.z<=i&&(t.z=i),t.z>=this.worldSize-i&&(t.z=this.worldSize-i)},i.update=function(t){var i=this;this.velocityIncrease.cloneFrom(this.gravityDirection).multiplyMutate(this.gravityForce*t/1e3),this.particles.forEach((function(t){t.velocity.addMutate(i.velocityIncrease)})),this.particles.forEach((function(t){i.newPosition.cloneFrom(t.particle.position).addMutate(t.velocity),i.ensureWorldBounds(i.newPosition,t.particle.radius),t.particle.position.cloneFrom(i.newPosition)}))},t}(),z=n(9477);var g=1e3/60,M=function(){function t(){!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),this.shouldStop=!1}var i=t.prototype;return i.startAnimation=function(t){var i=this,n=(0,d.Y)(t,10),e=n.scene,s=n.render,o=n.removeScene,r=new Array(10).fill(0).map((function(){var t=new y.O((0,p.i)(0,10),(0,p.i)(0,10),(0,p.i)(0,10));return new w(t,.5)})),a=new m(r,10),u=r.map((function(t){var i=new z.xo$(t.radius),n=new z.vBJ({color:16711680}),s=new z.Kj0(i,n);return s.position.set(t.position.x,t.position.y,t.position.z),e.add(s),{sphere:s,particle:t}})),h=function(){i.shouldStop||(a.update(g),setTimeout(h,g))},c=function(){i.shouldStop?o():(u.forEach((function(t){var i=t.sphere,n=t.particle;i.position.set(n.position.x,n.position.y,n.position.z)})),requestAnimationFrame(c),s())};c(),setTimeout(h,3e3)},i.stopAnimation=function(){this.shouldStop=!0},t}(),_=function(){var t=(0,c.useRef)(),i=(0,c.useRef)(null),n=(0,c.useCallback)((function(){t.current&&t.current.stopAnimation(),i.current&&(t.current=new M,t.current.startAnimation(i.current))}),[]);return(0,e.jsxs)(r.Z,{maxWidth:"lg",style:{minHeight:"100vh",paddingTop:"1rem",display:"flex",flexDirection:"column"},children:[(0,e.jsxs)(o(),{children:[(0,e.jsx)("title",{children:"Simulations"}),(0,e.jsx)("meta",{name:"description",content:"Gravity simulation for a single particle"}),(0,e.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,e.jsx)(a.Z,{variant:"h3",component:"h1",children:"Gravity simulation for a single particle"}),(0,e.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,e.jsx)(f(),{href:"/particle-gravity",children:"< Optimize Mesh"}),(0,e.jsx)(f(),{href:"/particle-collision",children:"Particle Collision >"})]}),(0,e.jsxs)(u.Z,{spacing:2,direction:"row",style:{flex:1},children:[(0,e.jsx)("div",{style:{flex:2},ref:i}),(0,e.jsx)(u.Z,{spacing:2,style:{flex:1},children:(0,e.jsx)(h.Z,{onClick:n,children:"Simulate"})})]})]})}},7995:function(t,i,n){"use strict";n.d(i,{Y:function(){return o}});var e=n(9477),s=n(9365),o=function(t,i){var n=t.clientWidth,o=t.clientHeight,r=new e.xsS,a=new e.cPb(75,n/o,.1,1e3);a.position.z=3*i;var u=new e.Mig(8421504);r.add(u);var h=new e.Ox3(16777215,1);h.position.x=a.position.x,h.position.y=a.position.y,h.position.z=a.position.z,r.add(h),new s.z(a,t);var c=new e.CP7;c.setSize(n,o),t.appendChild(c.domElement);return{scene:r,removeScene:function(){t.removeChild(c.domElement)},render:function(){c.render(r,a)}}}},3255:function(t,i,n){"use strict";n.d(i,{i:function(){return e}});var e=function(t,i){return Math.random()*(i-t)+t}}},function(t){t.O(0,[737,543,321,365,774,888,179],(function(){return i=5494,t(t.s=i);var i}));var i=t.O();_N_E=i}]);