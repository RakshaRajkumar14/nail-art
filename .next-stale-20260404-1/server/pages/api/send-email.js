"use strict";(()=>{var e={};e.id=957,e.ids=[957],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,a)=>{Object.defineProperty(a,"l",{enumerable:!0,get:function(){return function e(a,o){return o in a?a[o]:"then"in a&&"function"==typeof a.then?a.then(a=>e(a,o)):"function"==typeof a&&"default"===o?a:void 0}}})},6970:(e,a,o)=>{o.r(a),o.d(a,{config:()=>u,default:()=>p,routeModule:()=>m});var t={};o.r(t),o.d(t,{default:()=>l});var i=o(1802),s=o(7153),n=o(6249);async function l(e,a){if("POST"!==e.method)return a.status(405).json({success:!1,error:"Method not allowed"});try{let o;let{to:t,subject:i,templateType:s,data:n}=e.body;if(!t||!i||!s)return a.status(400).json({success:!1,error:"Missing required fields: to, subject, templateType"});let l=process.env.NEXT_PUBLIC_EMAIL_PROVIDER||"resend";return o="resend"===l?await r({to:t,subject:i,templateType:s,data:n}):"sendgrid"===l?await d({to:t,subject:i,templateType:s,data:n}):`sim_${Date.now()}`,a.status(200).json({success:!0,messageId:o})}catch(e){return a.status(500).json({success:!1,error:e.message||"Failed to send email"})}}async function r({to:e,subject:a,templateType:o,data:t}){let i=process.env.RESEND_API_KEY;if(!i)throw Error("RESEND_API_KEY not configured");let s=c(o,t),n=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({from:process.env.NEXT_PUBLIC_EMAIL_FROM||"noreply@elegancenails.com",to:e,subject:a,html:s,replyTo:process.env.NEXT_PUBLIC_EMAIL_REPLY_TO||"support@elegancenails.com"})});if(!n.ok){let e=await n.json();throw Error(`Resend API error: ${e.message}`)}return(await n.json()).id}async function d({to:e,subject:a,templateType:o,data:t}){let i=process.env.SENDGRID_API_KEY;if(!i)throw Error("SENDGRID_API_KEY not configured");let s=c(o,t),n=await fetch("https://api.sendgrid.com/v3/mail/send",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({personalizations:[{to:[{email:e}],subject:a}],from:{email:process.env.NEXT_PUBLIC_EMAIL_FROM||"noreply@elegancenails.com",name:"Elegance Nails"},replyTo:{email:process.env.NEXT_PUBLIC_EMAIL_REPLY_TO||"support@elegancenails.com"},content:[{type:"text/html",value:s}],trackingSettings:{clickTracking:{enable:!0},openTracking:{enable:!0}}})});if(!n.ok){let e=await n.text();throw Error(`SendGrid API error: ${e}`)}return`sendgrid_${Date.now()}`}function c(e,a={}){let o=`
    <style>
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background-color: #E6B7A9;
        color: #FAF7F4;
        padding: 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-family: 'Playfair Display', serif;
      }
      .content {
        padding: 30px;
      }
      .section {
        margin-bottom: 20px;
      }
      .label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #999;
        margin-bottom: 5px;
      }
      .detail-box {
        background-color: #FAF7F4;
        padding: 15px;
        border-radius: 6px;
        border-left: 4px solid #E6B7A9;
        margin: 15px 0;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .detail-row:last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 600;
        color: #1E1E1E;
      }
      .detail-value {
        color: #777777;
      }
      .button {
        display: inline-block;
        padding: 12px 30px;
        background-color: #E6B7A9;
        color: #FAF7F4;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        margin: 20px 0;
      }
      .footer {
        background-color: #F5F5F5;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #E0E0E0;
      }
      .social-link {
        display: inline-block;
        margin: 0 10px;
        color: #E6B7A9;
        text-decoration: none;
      }
    </style>
  `,t=`
      <div class="footer">
        <p>\xa9 2024 Elegance Nails. All rights reserved.</p>
        <div>
          <a href="https://facebook.com/elegancenails" class="social-link">Facebook</a>
          <a href="https://instagram.com/elegancenails" class="social-link">Instagram</a>
          <a href="https://twitter.com/elegancenails" class="social-link">Twitter</a>
        </div>
        <p><a href="mailto:support@elegancenails.com" style="color: #E6B7A9; text-decoration: none;">support@elegancenails.com</a></p>
      </div>
      </div>
    </body>
    </html>
  `;return`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${o}
    </head>
    <body>
      <div class="container">
  `+("booking-confirmation"===e?`
      <div class="header">
        <h1>✨ Booking Confirmed!</h1>
        <p>Thank you for choosing Elegance Nails</p>
      </div>
      <div class="content">
        <p>Hi ${a.customerName||"Guest"},</p>
        <p>Your appointment has been confirmed. Here are your booking details:</p>

        <div class="detail-box">
          <div class="label">Booking Reference</div>
          <div style="font-size: 18px; font-weight: bold; color: #E6B7A9; font-family: 'Courier New', monospace;">
            ${a.bookingRef||"NAB-"+Date.now()}
          </div>
        </div>

        <div class="section">
          <div class="label">Date & Time</div>
          <div style="font-size: 16px; color: #1E1E1E; font-weight: 500;">
            ${a.date||"TBA"} at ${a.time||"TBA"}
          </div>
        </div>

        <div class="section">
          <div class="label">Services</div>
          <div style="color: #1E1E1E;">
            ${a.services&&a.services.length>0?a.services.map(e=>`<div>• ${e}</div>`).join(""):"<div>Premium Nail Services</div>"}
          </div>
        </div>

        ${a.totalPrice?`
          <div class="section">
            <div class="label">Total Amount</div>
            <div style="font-size: 20px; color: #E6B7A9; font-weight: bold;">
              $${parseFloat(a.totalPrice).toFixed(2)}
            </div>
          </div>
        `:""}

        <div style="background-color: #FAF7F4; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1E1E1E;">What's Next?</h3>
          <ol style="margin: 10px 0; padding-left: 20px; color: #777;">
            <li>Please arrive 10 minutes early</li>
            <li>Bring your booking reference</li>
            <li>We'll send you a reminder 24 hours before</li>
            <li>Any changes? Just message us on WhatsApp</li>
          </ol>
        </div>

        <a href="${process.env.NEXT_PUBLIC_APP_URL||"https://elegancenails.com"}/bookings" class="button">View Your Booking</a>

        <p style="color: #999; font-size: 14px;">
          Questions? Contact us at <a href="tel:+1234567890" style="color: #E6B7A9; text-decoration: none;">+1 (234) 567-8900</a>
          or message us on <a href="https://wa.me/1234567890" style="color: #E6B7A9; text-decoration: none;">WhatsApp</a>
        </p>
      </div>
    `:"booking-reminder"===e?`
      <div class="header">
        <h1>📅 Reminder: Your Appointment Tomorrow</h1>
      </div>
      <div class="content">
        <p>Hi ${a.customerName||"Guest"},</p>
        <p>We're excited to see you tomorrow!</p>

        <div class="detail-box">
          <div class="detail-row">
            <span class="detail-label">Date & Time:</span>
            <span class="detail-value">${a.date} at ${a.time}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">123 Elegance Street, Beautiful City, BC 12345</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration:</span>
            <span class="detail-value">${a.duration||"45-60 minutes"}</span>
          </div>
        </div>

        <p>Please arrive 10 minutes early. If you need to reschedule, let us know as soon as possible.</p>

        <a href="https://wa.me/1234567890" class="button">Message us on WhatsApp</a>
      </div>
    `:"booking-cancelled"===e?`
      <div class="header">
        <h1>❌ Booking Cancelled</h1>
      </div>
      <div class="content">
        <p>Hi ${a.customerName||"Guest"},</p>
        <p>Your booking has been cancelled:</p>

        <div class="detail-box">
          <div class="detail-row">
            <span class="detail-label">Booking Reference:</span>
            <span class="detail-value">${a.bookingRef}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Original Date:</span>
            <span class="detail-value">${a.date}</span>
          </div>
        </div>

        <p>${a.message||"If you would like to rebook, please visit our website or contact us."}</p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL||"https://elegancenails.com"}/booking" class="button">Book Again</a>
      </div>
    `:`
      <div class="header">
        <h1>${a.title||"Message from Elegance Nails"}</h1>
      </div>
      <div class="content">
        <p>${a.message||"Hello,"}</p>
      </div>
    `)+t}let p=(0,n.l)(t,"default"),u=(0,n.l)(t,"config"),m=new i.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/send-email",pathname:"/api/send-email",bundlePath:"",filename:""},userland:t})},7153:(e,a)=>{var o;Object.defineProperty(a,"x",{enumerable:!0,get:function(){return o}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(o||(o={}))},1802:(e,a,o)=>{e.exports=o(145)}};var a=require("../../webpack-api-runtime.js");a.C(e);var o=a(a.s=6970);module.exports=o})();