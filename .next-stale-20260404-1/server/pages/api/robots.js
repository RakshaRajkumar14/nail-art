"use strict";(()=>{var e={};e.id=951,e.ids=[951],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},6189:(e,t,a)=>{a.r(t),a.d(t,{config:()=>d,default:()=>u,routeModule:()=>p});var l={};a.r(l),a.d(l,{default:()=>s});var o=a(1802),r=a(7153),i=a(6249);let n=process.env.NEXT_PUBLIC_API_URL?.replace("/api","")||"https://yourdomain.com";function s(e,t){if("GET"!==e.method)return t.status(405).json({error:"Method Not Allowed"});t.setHeader("Content-Type","text/plain; charset=utf-8"),t.setHeader("Cache-Control","public, s-maxage=604800");let a=`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /.next/
Disallow: /_next/
Disallow: /private/
Disallow: /admin-login
Disallow: /*?*
Allow: /*?utm_source=
Allow: /*?utm_medium=
Allow: /*?utm_campaign=

# Crawl delay in seconds
Crawl-delay: 0.5

# Request rate
Request-rate: 1/1s

# Specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

# Sitemaps
Sitemap: ${n}/sitemap.xml
Sitemap: ${n}/sitemap-pages.xml
Sitemap: ${n}/sitemap-services.xml
`;t.status(200).send(a)}let u=(0,i.l)(l,"default"),d=(0,i.l)(l,"config"),p=new o.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/robots",pathname:"/api/robots",bundlePath:"",filename:""},userland:l})},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var a=t(t.s=6189);module.exports=a})();