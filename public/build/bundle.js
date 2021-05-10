var app=function(){"use strict";function e(){}function t(e){return e()}function r(){return Object.create(null)}function n(e){e.forEach(t)}function a(e){return"function"==typeof e}function s(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function l(e,t){e.appendChild(t)}function o(e,t,r){e.insertBefore(t,r||null)}function i(e){e.parentNode.removeChild(e)}function c(e){return document.createElement(e)}function p(){return e=" ",document.createTextNode(e);var e}function d(e,t,r){null==r?e.removeAttribute(t):e.getAttribute(t)!==r&&e.setAttribute(t,r)}function u(e,t,r){e.classList[r?"add":"remove"](t)}let g;function x(e){g=e}const h=[],f=[],m=[],v=[],b=Promise.resolve();let y=!1;function w(e){m.push(e)}let $=!1;const k=new Set;function j(){if(!$){$=!0;do{for(let e=0;e<h.length;e+=1){const t=h[e];x(t),_(t.$$)}for(x(null),h.length=0;f.length;)f.pop()();for(let e=0;e<m.length;e+=1){const t=m[e];k.has(t)||(k.add(t),t())}m.length=0}while(h.length);for(;v.length;)v.pop()();y=!1,$=!1,k.clear()}}function _(e){if(null!==e.fragment){e.update(),n(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(w)}}const C=new Set;function S(e,t){e&&e.i&&(C.delete(e),e.i(t))}function L(e,t,r,n){if(e&&e.o){if(C.has(e))return;C.add(e),undefined.c.push((()=>{C.delete(e),n&&(r&&e.d(1),n())})),e.o(t)}}function M(e){e&&e.c()}function E(e,r,s,l){const{fragment:o,on_mount:i,on_destroy:c,after_update:p}=e.$$;o&&o.m(r,s),l||w((()=>{const r=i.map(t).filter(a);c?c.push(...r):n(r),e.$$.on_mount=[]})),p.forEach(w)}function T(e,t){const r=e.$$;null!==r.fragment&&(n(r.on_destroy),r.fragment&&r.fragment.d(t),r.on_destroy=r.fragment=null,r.ctx=[])}function q(e,t){-1===e.$$.dirty[0]&&(h.push(e),y||(y=!0,b.then(j)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function H(t,a,s,l,o,c,p=[-1]){const d=g;x(t);const u=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:o,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:a.context||[]),callbacks:r(),dirty:p,skip_bound:!1};let h=!1;if(u.ctx=s?s(t,a.props||{},((e,r,...n)=>{const a=n.length?n[0]:r;return u.ctx&&o(u.ctx[e],u.ctx[e]=a)&&(!u.skip_bound&&u.bound[e]&&u.bound[e](a),h&&q(t,e)),r})):[],u.update(),h=!0,n(u.before_update),u.fragment=!!l&&l(u.ctx),a.target){if(a.hydrate){const e=function(e){return Array.from(e.childNodes)}(a.target);u.fragment&&u.fragment.l(e),e.forEach(i)}else u.fragment&&u.fragment.c();a.intro&&S(t.$$.fragment),E(t,a.target,a.anchor,a.customElement),j()}x(d)}class P{$destroy(){T(this,1),this.$destroy=e}$on(e,t){const r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(t),()=>{const e=r.indexOf(t);-1!==e&&r.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function z(t){let r;return{c(){r=c("nav"),r.innerHTML='<ul class="p-2 space-y-2 flex-1"><li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 bg-gray-200 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" class="w-7 fill-current" width="24" height="24" viewBox="0 0 24 24"><path d="M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h7v-5h4v5h7v-10h3zm-5 8h-3v-5h-8v5h-3v-10.26l7-6.912 7 6.99v10.182z"></path></svg> \n                    <span class="text-gray-900">Dashboard</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>AWS</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Cryptocurrency</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Dev</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>E-Commerce</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Email</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Environment</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Finance</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Games</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>IoT</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Lifestyle</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Music</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Network</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Politics</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Science</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Sports</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>System</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Time</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Tools</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Travel</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Weather</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Web</span></a></li></ul>',d(r,"class","h-full flex flex-col w-auto border-r border-indigo-600")},m(e,t){o(e,r,t)},p:e,i:e,o:e,d(e){e&&i(r)}}}class A extends P{constructor(e){super(),H(this,e,null,z,s,{})}}function D(e){let t,r,n,a,s,g,x,h,f,m,v,b,y,w;return v=new A({}),{c(){t=c("div"),r=c("div"),n=c("a"),n.innerHTML='<svg class="w-8 text-deep-purple-accent-400" viewBox="0 0 24 24" stroke-linejoin="round" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" stroke="currentColor" fill="none"><rect x="3" y="1" width="7" height="12"></rect><rect x="3" y="17" width="7" height="6"></rect><rect x="14" y="1" width="7" height="6"></rect><rect x="14" y="11" width="7" height="12"></rect></svg> \n      <span class="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase mr-15">Company</span>',a=p(),s=c("img"),x=p(),h=c("div"),h.innerHTML='<button id="open" class="p-2 -mr-1 transition duration-200 rounded \n        focus:outline-none focus:shadow-outline hover:bg-purple-50 focus:bg-deep-purple-50 svelte-1t806hp"><svg class="w-5 text-gray-600" viewBox="0 0 24 24"><path fill="currentColor" d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"></path><path fill="currentColor" d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"></path><path fill="currentColor" d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"></path></svg></button> \n      <button id="close" class="p-2 -mr-1 transition duration-200 rounded \n        hover:bg-purple-50 focus:bg-gray-200 focus:outline-none focus:shadow-outline svelte-1t806hp"><svg class="w-5 text-gray-600" viewBox="0 0 24 24"><path fill="currentColor" d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 \n            c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 \n            c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"></path></svg></button>',f=p(),m=c("div"),M(v.$$.fragment),d(n,"href","/"),d(n,"aria-label","Company"),d(n,"title","Company"),d(n,"class","inline-flex items-center"),d(s,"class","h-12 w-12 rounded-full object-center mx-5"),s.src!==(g="https://avatars.githubusercontent.com/u/101659?v=4")&&d(s,"src","https://avatars.githubusercontent.com/u/101659?v=4"),d(s,"alt","Mat"),d(h,"class","lg:hidden svelte-1t806hp"),u(h,"active",e[0]),d(r,"class","relative flex items-center justify-between"),d(t,"class","px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-full md:px-24 lg:px-8"),d(m,"class","side-bar items-stretch md:items-center svelte-1t806hp"),u(m,"active",e[0])},m(i,c){var p,d,u,g;o(i,t,c),l(t,r),l(r,n),l(r,a),l(r,s),l(r,x),l(r,h),o(i,f,c),o(i,m,c),E(v,m,null),b=!0,y||(p=h,d="click",u=e[1],p.addEventListener(d,u,g),w=()=>p.removeEventListener(d,u,g),y=!0)},p(e,[t]){1&t&&u(h,"active",e[0]),1&t&&u(m,"active",e[0])},i(e){b||(S(v.$$.fragment,e),b=!0)},o(e){L(v.$$.fragment,e),b=!1},d(e){e&&i(t),e&&i(f),e&&i(m),T(v),y=!1,w()}}}function B(e,t,r){let n=!1;return[n,()=>r(0,n=!n)]}class I extends P{constructor(e){super(),H(this,e,B,D,s,{})}}function N(t){let r,n,a,s,u,g;return a=new A({}),{c(){r=c("div"),n=c("div"),M(a.$$.fragment),s=p(),u=c("div"),u.innerHTML='<h1 class="mx-auto text-3xl font-bold text-center font-Poppins leading-9 sm:text-5xl ">Put anything in your macOS menu bar</h1> \n    <div class="flex flex-wrap pb-4 mt-10 xl:flex-nowrap sm:flex-wrap"><div class="self-center w-full justify-self-center"><ul class="w-auto text-2xl text-blue-900 font-Poppins"><li class="items-center p-6 m-8 bg-white rounded-lg shadow-purple"><h2 class="motion-safe:hover:scale-110">Hundreds of pre-built plugins to choose from</h2></li> \n          <li class="items-center p-6 m-8 bg-white rounded-lg shadow-purple"><h2>Information you care about, at a glance</h2></li> \n          <li class="items-center p-6 m-8 bg-white rounded-lg shadow-purple"><h2>Write your own plugins—in any language</h2></li></ul></div> \n      <div class="w-full mt-8"><div class="flex items-center justify-center -mx-4 lg:pl-8"><div class="flex flex-col items-end px-3"><img class="object-cover mb-6 rounded shadow-purple h-28 sm:h-48 xl:h-56 w-28 sm:w-48 xl:w-56" src="./img/xbar-menu-preview.png" alt="xbar"/> \n            <img class="object-cover w-20 h-20 rounded shadow-purple sm:h-32 xl:h-40 sm:w-32 xl:w-40" src="./img/xbar-website-preview.jpg" alt="xbar"/></div> \n          <div class="px-3"><img class="object-cover w-40 h-40 rounded shadow-purple sm:h-64 xl:h-80 sm:w-64 xl:w-80" src="./img/xbar-menu-preview.png" alt="xbar"/></div></div></div></div> \n    <div class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20"><div class="grid gap-8 lg:grid-cols-3 sm:max-w-sm sm:mx-auto lg:max-w-full"><div class="overflow-hidden bg-white rounded transition-shadow duration-300 shadow-purple"><img src="https://xbarapp.com/docs/plugins/Dev/Homebrew/brew-services.10m.rb.jpg" class="object-cover w-full h-64" alt=""/> \n          <div class="p-5 border border-t-0"><p class="mb-3 text-xs font-semibold tracking-wide uppercase"><a href="/" class="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700">Dev</a> \n              <span class="text-gray-600">— 28 Dec 2020</span></p> \n            <a href="/" class="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700">Brew Services</a> \n            <p class="mb-2 text-gray-700">Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque.</p> \n            <a href="/" class="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">Learn more</a></div></div> \n        <div class="overflow-hidden bg-white rounded transition-shadow duration-300 shadow-purple"><img src="https://xbarapp.com/docs/plugins/E-Commerce/Shopibar.15m.js.png" class="object-cover w-full h-64" alt=""/> \n          <div class="p-5 border border-t-0"><p class="mb-3 text-xs font-semibold tracking-wide uppercase"><a href="/" class="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700">e-commerce</a> \n              <span class="text-gray-600">— 28 Dec 2020</span></p> \n            <a href="/" class="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700">Shopibar</a> \n            <p class="mb-2 text-gray-700">Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque.</p> \n            <a href="/" class="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">Learn more</a></div></div> \n        <div class="overflow-hidden bg-white rounded transition-shadow duration-300 shadow-purple"><img src="https://xbarapp.com/docs/plugins/Science/people-in-space.6h.js.png" class="object-cover w-full h-64" alt=""/> \n          <div class="p-5 border border-t-0"><p class="mb-3 text-xs font-semibold tracking-wide uppercase"><a href="/" class="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700">science</a> \n              <span class="text-gray-600">— 28 Dec 2020</span></p> \n            <a href="/" class="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700">People In Space</a> \n            <p class="mb-2 text-gray-700">Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque.</p> \n            <a href="/" class="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">Learn more</a></div></div></div></div>',d(n,"class","hidden w-64 lg:block"),d(u,"class","flex flex-col w-full "),d(r,"class","flex flex-row")},m(e,t){o(e,r,t),l(r,n),E(a,n,null),l(r,s),l(r,u),g=!0},p:e,i(e){g||(S(a.$$.fragment,e),g=!0)},o(e){L(a.$$.fragment,e),g=!1},d(e){e&&i(r),T(a)}}}class O extends P{constructor(e){super(),H(this,e,null,N,s,{})}}function W(t){let r;return{c(){r=c("div"),r.innerHTML='<div class="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row"><p class="text-sm text-gray-600">© Copyright 2021 Lorem Inc. All rights reserved.</p> \n    <ul class="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row"><li><a href="/" class="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">F.A.Q</a></li> \n      <li><a href="/" class="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Privacy Policy</a></li> \n      <li><a href="/" class="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Terms &amp; Conditions</a></li></ul></div>',d(r,"class","px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8")},m(e,t){o(e,r,t)},p:e,i:e,o:e,d(e){e&&i(r)}}}class F extends P{constructor(e){super(),H(this,e,null,W,s,{})}}function G(t){let r,n,a,s,u,g,x;return n=new I({}),s=new O({}),g=new F({}),{c(){r=c("div"),M(n.$$.fragment),a=p(),M(s.$$.fragment),u=p(),M(g.$$.fragment),d(r,"class","container mx-auto")},m(e,t){o(e,r,t),E(n,r,null),l(r,a),E(s,r,null),l(r,u),E(g,r,null),x=!0},p:e,i(e){x||(S(n.$$.fragment,e),S(s.$$.fragment,e),S(g.$$.fragment,e),x=!0)},o(e){L(n.$$.fragment,e),L(s.$$.fragment,e),L(g.$$.fragment,e),x=!1},d(e){e&&i(r),T(n),T(s),T(g)}}}return new class extends P{constructor(e){super(),H(this,e,null,G,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
