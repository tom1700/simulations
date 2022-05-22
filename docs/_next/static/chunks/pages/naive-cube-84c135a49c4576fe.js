(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[994],{1145:function(n,e,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/naive-cube",function(){return t(8284)}])},8861:function(n,e,t){"use strict";t.d(e,{T:function(){return d}});var i=t(5893),r=t(7948),a=t(5861),o=t(9008),s=t.n(o),c=t(6447),l=t(1664),u=t.n(l),f=function(n){var e=n.backLink,t=n.backLabel,r=n.forwardLink,a=n.forwardLabel;return(0,i.jsxs)(c.Z,{spacing:2,direction:"row",style:{justifyContent:"space-between",padding:"0.5rem 0",marginBottom:"0.5rem",borderBottom:"solid 1px #AAA"},children:[e&&(0,i.jsx)(u(),{href:e,children:t}),r&&(0,i.jsx)(u(),{href:r,children:a})]})},d=function(n){var e=n.title,t=n.subtitle,o=n.backLink,c=n.backLabel,l=n.forwardLink,u=n.forwardLabel,d=n.children;return(0,i.jsxs)(r.Z,{maxWidth:"lg",style:{minHeight:"100vh",display:"flex",flexDirection:"column"},children:[(0,i.jsxs)(s(),{children:[(0,i.jsx)("title",{children:"Simulations"}),(0,i.jsx)("meta",{name:"description",content:e}),(0,i.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,i.jsx)(f,{backLink:o,backLabel:c,forwardLink:l,forwardLabel:u}),(0,i.jsx)(a.Z,{variant:"h3",component:"h1",children:e}),t&&(0,i.jsx)(a.Z,{variant:"subtitle1",children:t}),d]})}},8284:function(n,e,t){"use strict";t.r(e);var i=t(5893),r=t(6447),a=t(7507),o=t(3321),s=t(7294),c=t(9477),l=t(9365),u=t(8861);function f(n){return Math.pow(2,n-8)}var d=function(){function n(){!function(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),this.shouldStop=!1}var e=n.prototype;return e.startAnimation=function(n,e,t){var i=this,r=n.clientWidth,a=n.clientHeight,o=new c.xsS,s=new c.cPb(75,r/a,.1,1e3),u=new c.nls({color:16777215});new c.vBJ({color:14483456});new l.z(s,n),s.position.z=3*e;var f=new c.CP7;f.setSize(r,a),n.appendChild(f.domElement);for(var d=new c.DvJ(t,t,t),h=new c.TOt(d),b=0;b<e/t;b+=1)for(var p=0;p<e/t;p+=1)for(var m=0;m<e/t;m+=1){var w=new c.ejS(h,u);w.position.x=b*t-e/2,w.position.y=p*t-e/2,w.position.z=m*t-e/2,o.add(w)}var v=function(){i.shouldStop?n.removeChild(f.domElement):(requestAnimationFrame(v),f.render(o,s))};v()},e.stopAnimation=function(){this.shouldStop=!0},n}();e.default=function(){var n=(0,s.useState)(10),e=n[0],t=n[1],c=(0,s.useState)(8),l=c[0],h=c[1],b=(0,s.useRef)(),p=(0,s.useRef)(null),m=(0,s.useCallback)((function(){b.current&&b.current.stopAnimation(),p.current&&(b.current=new d,b.current.startAnimation(p.current,e,f(l)))}),[l,e]);return(0,i.jsx)(u.T,{title:"Dynamic Cube Naive implementation",subtitle:"Making a big cube out of a smaller cubes.",backLink:"/",backLabel:"< Home",forwardLink:"/cube-with-noise",forwardLabel:"Cube With Noise >",children:(0,i.jsxs)(r.Z,{spacing:2,direction:"row",style:{flex:1},children:[(0,i.jsx)("div",{style:{flex:2},ref:p}),(0,i.jsxs)(r.Z,{spacing:2,style:{flex:1},children:["Size: ",e,(0,i.jsx)(a.ZP,{min:1,max:100,step:1,value:e,onChange:function(n,e){return!Array.isArray(e)&&t(e)}}),"Resolution:"," ",f(l),(0,i.jsx)(a.ZP,{scale:f,value:l,min:1,step:1,max:8,valueLabelDisplay:"auto",onChange:function(n,e){return!Array.isArray(e)&&h(e)}}),"Total Grid Size:"," ",Math.pow(e/f(l),3),(0,i.jsx)(o.Z,{onClick:m,children:"Create"})]})]})})}}},function(n){n.O(0,[737,543,321,507,365,774,888,179],(function(){return e=1145,n(n.s=e);var e}));var e=n.O();_N_E=e}]);