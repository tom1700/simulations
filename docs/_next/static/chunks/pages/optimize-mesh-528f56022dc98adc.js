(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[325],{2263:function(t,n,e){(window.__NEXT_P=window.__NEXT_P||[]).push(["/optimize-mesh",function(){return e(5277)}])},8861:function(t,n,e){"use strict";e.d(n,{T:function(){return l}});var r=e(5893),i=e(7948),o=e(5861),u=e(9008),a=e.n(u),s=e(6447),h=e(1664),c=e.n(h),f=function(t){var n=t.backLink,e=t.backLabel,i=t.forwardLink,o=t.forwardLabel;return(0,r.jsxs)(s.Z,{spacing:2,direction:"row",style:{justifyContent:"space-between",padding:"0.5rem 0",marginBottom:"0.5rem",borderBottom:"solid 1px #AAA"},children:[n&&(0,r.jsx)(c(),{href:n,children:e}),i&&(0,r.jsx)(c(),{href:i,children:o})]})},l=function(t){var n=t.title,e=t.subtitle,u=t.backLink,s=t.backLabel,h=t.forwardLink,c=t.forwardLabel,l=t.children;return(0,r.jsxs)(i.Z,{maxWidth:"lg",style:{minHeight:"100vh",display:"flex",flexDirection:"column"},children:[(0,r.jsxs)(a(),{children:[(0,r.jsx)("title",{children:"Simulations"}),(0,r.jsx)("meta",{name:"description",content:n}),(0,r.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,r.jsx)(f,{backLink:u,backLabel:s,forwardLink:h,forwardLabel:c}),(0,r.jsx)(o.Z,{variant:"h3",component:"h1",children:n}),e&&(0,r.jsx)(o.Z,{variant:"subtitle1",children:e}),l]})}},3254:function(t,n,e){"use strict";function r(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}e.d(n,{Nm:function(){return o},qT:function(){return s}});var o,u=function(t,n,e,r,i){return e*r*i+n*r+t},a=function(t,n,e){var r=Math.floor(t/(n*e));return{x:(t-=r*n*e)%n,y:Math.floor(t/n),z:r}};!function(t){t.TOP="TOP",t.RIGHT="RIGHT",t.LEFT="LEFT",t.BOTTOM="BOTTOM",t.FRONT="FRONT",t.BACK="BACK"}(o||(o={}));var s=function(){function t(n,e,r){var s,h=this;!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t),this.hasNeighbour=function(t,n,e,r){var i=h.buffer,o=h.getNeighbourIndex(t,n,e,r);return!(o<0||o>i.length)&&(0===n&&1===e&&0===r&&console.log(t,n,e,r,a(o,h.width,h.height),i[o]),!!i[o])},this._width=n,this._height=e,this._depth=r,this.buffer=new Array(this.width*this.depth*this.height),this.resetBuffer(),this.neighbourFunctionMap=(i(s={},o.TOP,(function(t,r,i){return h.isYWithinBounds(r+1)?u(t,r+1,i,n,e):-1})),i(s,o.BOTTOM,(function(t,r,i){return h.isYWithinBounds(r-1)?u(t,r-1,i,n,e):-1})),i(s,o.BACK,(function(t,r,i){return h.isZWithinBounds(i-1)?u(t,r,i-1,n,e):-1})),i(s,o.FRONT,(function(t,r,i){return h.isZWithinBounds(i+1)?u(t,r,i+1,n,e):-1})),i(s,o.LEFT,(function(t,r,i){return h.isXWithinBounds(t-1)?u(t-1,r,i,n,e):-1})),i(s,o.RIGHT,(function(t,r,i){return h.isXWithinBounds(t+1)?u(t+1,r,i,n,e):-1})),s)}var n,e,s,h=t.prototype;return h.isYWithinBounds=function(t){return t>0&&t<this.height},h.isXWithinBounds=function(t){return t>0&&t<this.width},h.isZWithinBounds=function(t){return t>0&&t<this.depth},h.resetBuffer=function(){for(var t=0;t<this.buffer.length;t++)this.buffer[t]=""},h.getNeighbourIndex=function(t,n,e,r){return this.neighbourFunctionMap[t](n,e,r)},h.setValue=function(t,n,e,r){var i=this,o=i.width,a=i.height,s=i.depth;t<0||n<0||e<0||t>=o||n>=a||e>=s||(this.buffer[u(t,n,e,o,a)]=r)},h.getValue=function(t,n,e){var r=this,i=r.width,o=r.height,a=r.depth;if(!(t<0||n<0||e<0||t>=i||n>=o||e>=a))return this.buffer[u(t,n,e,i,o)]},h.forEach=function(t){var n=this;this.buffer.forEach((function(e,r){var i=a(r,n.width,n.height),o=i.x,u=i.y,s=i.z;return t(e,o,u,s)}))},n=t,(e=[{key:"width",get:function(){return this._width}},{key:"height",get:function(){return this._height}},{key:"depth",get:function(){return this._depth}}])&&r(n.prototype,e),s&&r(n,s),t}()},832:function(t,n,e){"use strict";e.d(n,{$:function(){return i}});var r=e(7048),i=function(t,n,e,i){t.resetBuffer();for(var o=new r.ZP(n),u=0;u<=t.width;u+=1)for(var a=0;a<=t.depth;a+=1)for(var s=Math.floor((o.noise2D(u/e,a/e)+1)/2*t.height/i);s>=0;)t.setValue(u,s,a,"true"),s-=1}},5277:function(t,n,e){"use strict";e.r(n),e.d(n,{default:function(){return T}});var r=e(5893),i=e(6447),o=e(3242),u=e(7507),a=e(3321),s=e(7294),h=e(9477),c=e(3254),f=e(1317),l=e(832);function d(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}function p(t){return function(t){if(Array.isArray(t))return d(t)}(t)||function(t){if("undefined"!==typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,n){if(!t)return;if("string"===typeof t)return d(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);"Object"===e&&t.constructor&&(e=t.constructor.name);if("Map"===e||"Set"===e)return Array.from(e);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return d(t,n)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var b=[.7,0,0,.7,0,0,.7,0,0,.7,0,0,.7,0,0,.7,0,0],v=[0,0,.7,0,0,.7,0,0,.7,0,0,.7,0,0,.7,0,0,.7],m=[0,.7,0,0,.7,0,0,.7,0,0,.7,0,0,.7,0,0,.7,0],w=e(7995),g=e(8861);function y(t){return Math.pow(2,t-8)}var x=function(){function t(){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t),this.shouldStop=!1}var n=t.prototype;return n.initializeGrid=function(t,n,e,r,i){var o=new c.qT(t/n,t/n,t/n);return(0,l.$)(o,e,r,i),o},n.startAnimation=function(t,n,e,r,i,o,u){var a=this,s=(0,w.Y)(t,n),f=s.scene,l=s.render,d=s.removeScene,g=new h.nls({color:16777215}),y=function(t,n){var e=new h.u9r,r=[],i=[];t.forEach((function(e,o,u,a){if(!e)return[];var s,h,f,l,d,w,g=o*n,y=u*n,x=a*n,T=n/2;t.hasNeighbour(c.Nm.FRONT,o,u,a)||(r.push(g-T,y-T,x+T,g+T,y-T,x+T,g+T,y+T,x+T,g+T,y+T,x+T,g-T,y+T,x+T,g-T,y-T,x+T),(s=i).push.apply(s,p(m))),t.hasNeighbour(c.Nm.BACK,o,u,a)||(r.push(g+T,y+T,x-T,g+T,y-T,x-T,g-T,y-T,x-T,g-T,y-T,x-T,g-T,y+T,x-T,g+T,y+T,x-T),(h=i).push.apply(h,p(m))),t.hasNeighbour(c.Nm.TOP,o,u,a)||(r.push(g-T,y+T,x-T,g-T,y+T,x+T,g+T,y+T,x+T,g+T,y+T,x+T,g+T,y+T,x-T,g-T,y+T,x-T),(f=i).push.apply(f,p(b))),t.hasNeighbour(c.Nm.BOTTOM,o,u,a)||(r.push(g+T,y-T,x+T,g-T,y-T,x+T,g-T,y-T,x-T,g-T,y-T,x-T,g+T,y-T,x-T,g+T,y-T,x+T),(l=i).push.apply(l,p(b))),t.hasNeighbour(c.Nm.LEFT,o,u,a)||(r.push(g-T,y-T,x-T,g-T,y-T,x+T,g-T,y+T,x+T,g-T,y+T,x+T,g-T,y+T,x-T,g-T,y-T,x-T),(d=i).push.apply(d,p(v))),t.hasNeighbour(c.Nm.RIGHT,o,u,a)||(r.push(g+T,y+T,x+T,g+T,y-T,x+T,g+T,y-T,x-T,g+T,y-T,x-T,g+T,y+T,x-T,g+T,y+T,x+T),(w=i).push.apply(w,p(v)))}));var o=new Float32Array(r),u=new Float32Array(i);return e.setAttribute("position",new h.TlE(o,3)),e.setAttribute("color",new h.TlE(u,3)),e}(this.initializeGrid(n,e,r,i,o),e);if(u){y.computeVertexNormals();var x=new h.Wid({vertexColors:!0}),T=new h.Kj0(y,x);T.position.x=-n/2,T.position.z=-n/2,f.add(T)}else{var j=new h.TOt(y),A=new h.ejS(j,g);A.position.x=-n/2,A.position.z=-n/2,f.add(A)}var k=function(){a.shouldStop?d():(requestAnimationFrame(k),l())};k()},n.stopAnimation=function(){this.shouldStop=!0},t}(),T=function(){var t=(0,s.useState)(10),n=t[0],e=t[1],h=(0,s.useState)(1),c=h[0],l=h[1],d=(0,s.useState)(8),p=d[0],b=d[1],v=(0,s.useState)(1),m=v[0],w=v[1],T=(0,s.useState)(!1),j=T[0],A=T[1],k=(0,s.useState)("John"),N=k[0],C=k[1],S=(0,s.useRef)(),O=(0,s.useRef)(null),B=(0,s.useCallback)((function(){S.current&&S.current.stopAnimation(),O.current&&(S.current=new x,S.current.startAnimation(O.current,n,y(p),N,c,m,j))}),[m,p,N,n,c,j]);return(0,r.jsx)(g.T,{title:"Cube based on noise with optimized mesh",subtitle:"The same as the previous one, but this time I'm building a custom geometry to avoid rendering the vertices that are inside.",backLink:"/cube-with-noise",backLabel:"< Cube with noise",forwardLink:"/particle-gravity",forwardLabel:"Particle Gravity >",children:(0,r.jsxs)(i.Z,{spacing:2,direction:"row",style:{flex:1},children:[(0,r.jsx)("div",{style:{flex:2},ref:O}),(0,r.jsxs)(i.Z,{spacing:2,style:{flex:1},children:["Size: ",n,(0,r.jsx)(u.ZP,{min:1,max:100,step:1,value:n,onChange:function(t,n){return!Array.isArray(n)&&e(n)}}),"Resolution:"," ",y(p),(0,r.jsx)(u.ZP,{scale:y,value:p,min:1,step:1,max:8,valueLabelDisplay:"auto",onChange:function(t,n){return!Array.isArray(n)&&b(n)}}),"Total Grid Size:"," ",Math.pow(n/y(p),3),(0,r.jsx)("br",{}),"Seed",(0,r.jsx)(f.Z,{value:N,onChange:function(t){return C(t.target.value)}}),"Smoothness:"," ",c,(0,r.jsx)(u.ZP,{min:1,max:40,step:1,value:c,onChange:function(t,n){return!Array.isArray(n)&&l(n)}}),"Noise strength reduction: ",m,(0,r.jsx)(u.ZP,{min:1,max:10,step:.25,value:m,onChange:function(t,n){return!Array.isArray(n)&&w(n)}}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:["Show mesh",(0,r.jsx)(o.Z,{value:j,onChange:function(t,n){A(n)}})]}),(0,r.jsx)(a.Z,{onClick:B,children:"Create"})]})]})})}},7995:function(t,n,e){"use strict";e.d(n,{Y:function(){return o}});var r=e(9477),i=e(9365),o=function(t,n){var e=t.clientWidth,o=t.clientHeight,u=new r.xsS,a=new r.cPb(75,e/o,.1,1e3);a.position.z=3*n;var s=new r.Mig(8421504);u.add(s);var h=new r.Ox3(16777215,1);h.position.x=a.position.x,h.position.y=a.position.y,h.position.z=a.position.z,u.add(h),new i.z(a,t);var c=new r.CP7;c.setSize(e,o),t.appendChild(c.domElement);return{scene:u,removeScene:function(){t.removeChild(c.domElement)},render:function(){c.render(u,a)}}}}},function(t){t.O(0,[737,543,321,507,365,153,242,774,888,179],(function(){return n=2263,t(t.s=n);var n}));var n=t.O();_N_E=n}]);