var app=function(){"use strict";function e(){}function t(e){return e()}function s(){return Object.create(null)}function a(e){e.forEach(t)}function n(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function l(e,t){e.appendChild(t)}function i(e,t,s){e.insertBefore(t,s||null)}function o(e){e.parentNode.removeChild(e)}function c(e){return document.createElement(e)}function d(){return e=" ",document.createTextNode(e);var e}function x(e,t,s){null==s?e.removeAttribute(t):e.getAttribute(t)!==s&&e.setAttribute(t,s)}function p(e,t,s){e.classList[s?"add":"remove"](t)}let m;function u(e){m=e}const g=[],f=[],h=[],v=[],y=Promise.resolve();let b=!1;function w(e){h.push(e)}let $=!1;const k=new Set;function j(){if(!$){$=!0;do{for(let e=0;e<g.length;e+=1){const t=g[e];u(t),_(t.$$)}for(u(null),g.length=0;f.length;)f.pop()();for(let e=0;e<h.length;e+=1){const t=h[e];k.has(t)||(k.add(t),t())}h.length=0}while(g.length);for(;v.length;)v.pop()();b=!1,$=!1,k.clear()}}function _(e){if(null!==e.fragment){e.update(),a(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(w)}}const S=new Set;function C(e,t){e&&e.i&&(S.delete(e),e.i(t))}function M(e,t,s,a){if(e&&e.o){if(S.has(e))return;S.add(e),undefined.c.push((()=>{S.delete(e),a&&(s&&e.d(1),a())})),e.o(t)}}function L(e){e&&e.c()}function B(e,s,r,l){const{fragment:i,on_mount:o,on_destroy:c,after_update:d}=e.$$;i&&i.m(s,r),l||w((()=>{const s=o.map(t).filter(n);c?c.push(...s):a(s),e.$$.on_mount=[]})),d.forEach(w)}function E(e,t){const s=e.$$;null!==s.fragment&&(a(s.on_destroy),s.fragment&&s.fragment.d(t),s.on_destroy=s.fragment=null,s.ctx=[])}function T(e,t){-1===e.$$.dirty[0]&&(g.push(e),b||(b=!0,y.then(j)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function q(t,n,r,l,i,c,d=[-1]){const x=m;u(t);const p=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:i,bound:s(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(x?x.$$.context:n.context||[]),callbacks:s(),dirty:d,skip_bound:!1};let g=!1;if(p.ctx=r?r(t,n.props||{},((e,s,...a)=>{const n=a.length?a[0]:s;return p.ctx&&i(p.ctx[e],p.ctx[e]=n)&&(!p.skip_bound&&p.bound[e]&&p.bound[e](n),g&&T(t,e)),s})):[],p.update(),g=!0,a(p.before_update),p.fragment=!!l&&l(p.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);p.fragment&&p.fragment.l(e),e.forEach(o)}else p.fragment&&p.fragment.c();n.intro&&C(t.$$.fragment),B(t,n.target,n.anchor,n.customElement),j()}u(x)}class H{$destroy(){E(this,1),this.$destroy=e}$on(e,t){const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(t),()=>{const e=s.indexOf(t);-1!==e&&s.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function P(t){let s;return{c(){s=c("nav"),s.innerHTML='<ul class="p-2 space-y-2 flex-1"><li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 bg-gray-200 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" class="w-7 fill-current" width="24" height="24" viewBox="0 0 24 24"><path d="M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h7v-5h4v5h7v-10h3zm-5 8h-3v-5h-8v5h-3v-10.26l7-6.912 7 6.99v10.182z"></path></svg> \n                    <span class="text-gray-900">Dashboard</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>AWS</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Cryptocurrency</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Dev</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>E-Commerce</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Email</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Environment</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Finance</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Games</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>IoT</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Lifestyle</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Music</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Network</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Politics</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Science</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Sports</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>System</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Time</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Tools</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Travel</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Weather</span></a></li> \n            <li><a href="/" class="flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900"><span>Web</span></a></li></ul>',x(s,"class","h-full flex flex-col w-auto border-r border-indigo-600")},m(e,t){i(e,s,t)},p:e,i:e,o:e,d(e){e&&o(s)}}}class A extends H{constructor(e){super(),q(this,e,null,P,r,{})}}function z(e){let t,s,a,n,r,m,u,g,f,h,v,y,b,w;return v=new A({}),{c(){t=c("div"),s=c("div"),a=c("a"),a.innerHTML='<svg class="w-8 text-deep-purple-accent-400" viewBox="0 0 24 24" stroke-linejoin="round" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" stroke="currentColor" fill="none"><rect x="3" y="1" width="7" height="12"></rect><rect x="3" y="17" width="7" height="6"></rect><rect x="14" y="1" width="7" height="6"></rect><rect x="14" y="11" width="7" height="12"></rect></svg> \n      <span class="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase mr-15">Company</span>',n=d(),r=c("img"),u=d(),g=c("div"),g.innerHTML='<button aria-label="Open Menu" title="Open Menu" class="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50"><svg class="w-5 text-gray-600" viewBox="0 0 24 24"><path fill="currentColor" d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"></path><path fill="currentColor" d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"></path><path fill="currentColor" d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"></path></svg></button>',f=d(),h=c("div"),L(v.$$.fragment),x(a,"href","/"),x(a,"aria-label","Company"),x(a,"title","Company"),x(a,"class","inline-flex items-center"),x(r,"class","h-8 w-8 rounded-full object-center"),r.src!==(m="https://avatars.githubusercontent.com/u/101659?v=4")&&x(r,"src","https://avatars.githubusercontent.com/u/101659?v=4"),x(r,"alt","Mat"),x(g,"class","lg:hidden svelte-yjs2bx"),p(g,"active",e[0]),x(s,"class","relative flex items-center justify-between"),x(t,"class","px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-full md:px-24 lg:px-8"),x(h,"class","side-bar items-stretch md:items-center svelte-yjs2bx"),p(h,"active",e[0])},m(o,c){var d,x,p,m;i(o,t,c),l(t,s),l(s,a),l(s,n),l(s,r),l(s,u),l(s,g),i(o,f,c),i(o,h,c),B(v,h,null),y=!0,b||(d=g,x="click",p=e[1],d.addEventListener(x,p,m),w=()=>d.removeEventListener(x,p,m),b=!0)},p(e,[t]){1&t&&p(g,"active",e[0]),1&t&&p(h,"active",e[0])},i(e){y||(C(v.$$.fragment,e),y=!0)},o(e){M(v.$$.fragment,e),y=!1},d(e){e&&o(t),e&&o(f),e&&o(h),E(v),b=!1,w()}}}function O(e,t,s){let a=!1;return[a,()=>s(0,a=!a)]}class G extends H{constructor(e){super(),q(this,e,O,z,r,{})}}function N(t){let s,a,n,r,p,m;return n=new A({}),{c(){s=c("div"),a=c("div"),L(n.$$.fragment),r=d(),p=c("div"),p.innerHTML='<div class="max-w-xl md:mx-auto sm:text-center items-start lg:max-w-2xl mb-20  -mt-9"><h1 class="font-sans text-5xl font-bold">Put anything in your macOS menu bar</h1></div> \n    <div class="grid gap-10 lg:grid-cols-2"><div class="flex flex-col justify-center md:pr-8 xl:pr-0 lg:max-w-lg"><div class="max-w-xl mb-6"><h2 class="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">Let us handle<br class="hidden md:block"/>\n            your next\n            <span class="inline-block text-deep-purple-accent-400">destination</span></h2> \n          <p class="text-base text-gray-700 md:text-lg">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae. explicabo.</p></div> \n        <div class="mb-8"><a href="/" aria-label="" class="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">Learn more</a></div> \n        <div class="max-w-xl mb-6"><h2 class="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">Let us handle<br class="hidden md:block"/>\n            your next\n            <span class="inline-block text-deep-purple-accent-400">destination</span></h2> \n          <p class="text-base text-gray-700 md:text-lg">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae. explicabo.</p></div> \n        <div><a href="/" aria-label="" class="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">Learn more</a></div></div> \n      <div class="flex items-center justify-center -mx-4 lg:pl-8"><div class="flex flex-col items-end px-3"><img class="object-cover mb-6 rounded shadow-lg h-28 sm:h-48 xl:h-56 w-28 sm:w-48 xl:w-56" src="./img/xbar-menu-preview.png?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260" alt=""/> \n          <img class="object-cover w-20 h-20 rounded shadow-lg sm:h-32 xl:h-40 sm:w-32 xl:w-40" src="./img/xbar-website-preview.jpg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260" alt=""/></div> \n        <div class="px-3"><img class="object-cover w-40 h-40 rounded shadow-lg sm:h-64 xl:h-80 sm:w-64 xl:w-80" src="./img/xbar-menu-preview.png?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;w=500" alt=""/></div></div></div> \n<div class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20"><div class="grid max-w-md gap-10 row-gap-5 lg:max-w-screen-lg sm:row-gap-10 lg:grid-cols-3 xl:max-w-screen-lg sm:mx-auto"><div class="flex flex-col justify-between p-8 transition-shadow duration-300 bg-white border rounded shadow-sm sm:items-center hover:shadow"><div class="text-center"><div class="text-lg font-semibold">Start</div> \n          <div class="flex items-center justify-center mt-2"><div class="mr-1 text-5xl font-bold">Free</div></div> \n          <div class="mt-2 space-y-3"><div class="text-gray-700">10 deploys per day</div> \n            <div class="text-gray-700">10 GB of storage</div> \n            <div class="text-gray-700">20 domains</div></div></div> \n        <div><a href="/" class="inline-flex items-center justify-center w-full h-12 px-6 mt-6 font-medium \n             tracking-wide text-white transition duration-200 bg-gray-400 rounded shadow-md \n             hover:bg-gray-900 focus:shadow-outline focus:outline-none">Start for free</a> \n          <p class="max-w-xs mt-6 text-xs text-gray-600 sm:text-sm sm:text-center sm:max-w-sm sm:mx-auto">Sed ut unde omnis iste natus accusantium doloremque.</p></div></div> \n      <div class="relative flex flex-col justify-between p-8 transition-shadow duration-300 bg-white border rounded shadow-sm sm:items-center hover:shadow border-purple-400"><div class="absolute inset-x-0 top-0 flex justify-center -mt-3"><div class="inline-block px-3 py-1 text-xs font-medium tracking-wider text-white uppercase rounded bg-purple-400">Most Popular</div></div> \n        <div class="text-center"><div class="text-lg font-semibold">Pro</div> \n          <div class="flex items-center justify-center mt-2"><div class="mr-1 text-5xl font-bold">$38</div> \n            <div class="text-gray-700">/ mo</div></div> \n          <div class="mt-2 space-y-3"><div class="text-gray-700">200 deploys per day</div> \n            <div class="text-gray-700">80 GB of storage</div> \n            <div class="text-gray-700">Global CDN</div></div></div> \n        <div><a href="/" class="inline-flex items-center justify-center w-full h-12 px-6 mt-6 font-medium \n            tracking-wide text-white transition duration-200 rounded shadow-md bg-purple-400 \n            hover:bg-purple-700 focus:shadow-outline focus:outline-none">Buy Pro</a> \n          <p class="max-w-xs mt-6 text-xs text-gray-600 sm:text-sm sm:text-center sm:max-w-sm sm:mx-auto">Sed ut unde omnis iste natus accusantium doloremque.</p></div></div> \n      <div class="flex flex-col justify-between p-8 transition-shadow duration-300 bg-white border rounded shadow-sm sm:items-center hover:shadow"><div class="text-center"><div class="text-lg font-semibold">Business</div> \n          <div class="flex items-center justify-center mt-2"><div class="mr-1 text-5xl font-bold">$78</div> \n            <div class="text-gray-700">/ mo</div></div> \n          <div class="mt-2 space-y-3"><div class="text-gray-700">500 GB of storage</div> \n            <div class="text-gray-700">Unlimited domains</div> \n            <div class="text-gray-700">24/7 Support</div></div></div> \n        <div><a href="/" class="inline-flex items-center justify-center w-full h-12 px-6 mt-6 font-medium \n            tracking-wide text-white transition duration-200 bg-gray-400 rounded shadow-md \n            hover:bg-gray-900 focus:shadow-outline focus:outline-none">Buy Business</a> \n          <p class="max-w-xs mt-6 text-xs text-gray-600 sm:text-sm sm:text-center sm:max-w-sm sm:mx-auto">Sed ut unde omnis iste natus accusantium doloremque.</p></div></div></div></div>',x(a,"class","row-span-2 lg:block hidden w-64"),x(p,"class","px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20"),x(s,"class","flex ")},m(e,t){i(e,s,t),l(s,a),B(n,a,null),l(s,r),l(s,p),m=!0},p:e,i(e){m||(C(n.$$.fragment,e),m=!0)},o(e){M(n.$$.fragment,e),m=!1},d(e){e&&o(s),E(n)}}}class D extends H{constructor(e){super(),q(this,e,null,N,r,{})}}function F(t){let s;return{c(){s=c("div"),s.innerHTML='<div class="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row"><p class="text-sm text-gray-600">© Copyright 2021 Lorem Inc. All rights reserved.</p> \n    <ul class="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row"><li><a href="/" class="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">F.A.Q</a></li> \n      <li><a href="/" class="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Privacy Policy</a></li> \n      <li><a href="/" class="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Terms &amp; Conditions</a></li></ul></div>',x(s,"class","px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8")},m(e,t){i(e,s,t)},p:e,i:e,o:e,d(e){e&&o(s)}}}class W extends H{constructor(e){super(),q(this,e,null,F,r,{})}}function I(t){let s,a,n,r,p,m,u;return a=new G({}),r=new D({}),m=new W({}),{c(){s=c("div"),L(a.$$.fragment),n=d(),L(r.$$.fragment),p=d(),L(m.$$.fragment),x(s,"class","container mx-auto bg-gradient-to-r from-purple-100 via-purple-300 to-purple-100")},m(e,t){i(e,s,t),B(a,s,null),l(s,n),B(r,s,null),l(s,p),B(m,s,null),u=!0},p:e,i(e){u||(C(a.$$.fragment,e),C(r.$$.fragment,e),C(m.$$.fragment,e),u=!0)},o(e){M(a.$$.fragment,e),M(r.$$.fragment,e),M(m.$$.fragment,e),u=!1},d(e){e&&o(s),E(a),E(r),E(m)}}}return new class extends H{constructor(e){super(),q(this,e,null,I,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map