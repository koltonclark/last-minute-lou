import { useState, useEffect, useRef } from "react";

const AFFILIATES = {
  seatgeek:  "YOUR_SEATGEEK_ID",
  stubhub:   "YOUR_STUBHUB_ID",
  opentable: "YOUR_OPENTABLE_ID",
  booking:   "YOUR_BOOKING_ID",
};

function sgLink(artist) {
  const slug = artist.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const aid = AFFILIATES.seatgeek;
  const base = `https://seatgeek.com/${slug}-tickets`;
  return aid === "YOUR_SEATGEEK_ID" ? `${base}?utm_source=lastminutelou` : `${base}?aid=${aid}&utm_source=lastminutelou`;
}
function shLink(artist) {
  const q = encodeURIComponent(artist);
  const aid = AFFILIATES.stubhub;
  const base = `https://www.stubhub.com/secure/search?q=${q}`;
  return aid === "YOUR_STUBHUB_ID" ? `${base}&utm_source=lastminutelou` : `${base}&ats=${aid}&utm_source=lastminutelou`;
}
function otLink(name) {
  const q = encodeURIComponent(name + " Louisville KY");
  const aid = AFFILIATES.opentable;
  return aid === "YOUR_OPENTABLE_ID"
    ? `https://www.opentable.com/s/?term=${q}&utm_source=lastminutelou`
    : `https://www.opentable.com/s/?term=${q}&ref=${aid}&utm_source=lastminutelou`;
}
function bookingLink(area) {
  const q = encodeURIComponent(area || "Louisville, Kentucky");
  const aid = AFFILIATES.booking;
  return aid === "YOUR_BOOKING_ID"
    ? `https://www.booking.com/search.html?ss=${q}&utm_source=lastminutelou`
    : `https://www.booking.com/search.html?ss=${q}&aid=${aid}&utm_source=lastminutelou`;
}

const SEED_EVENTS = [
  { id: 0, day: 0, title: "Zach Bryan Tribute Night", venue: "Mercury Ballroom", address: "614 W Main St, Louisville, KY", time: "9 PM", doors: "8 PM", category: "Music", emoji: "🎸", tags: ["Live Music", "Hot 🔥"], free: false, featured: true, price: "$15-$25", ticketUrl: sgLink("Zach Bryan Tribute"), ticketLabel: "🎟 Get Tickets", desc: "Louisville's best tribute act takes the stage for a full night of Zach Bryan covers. Expect a packed house, cold beers, and every song you know by heart." },
  { id: 1, day: 0, title: "Nachbar Thursday Trivia", venue: "Nachbar", address: "969 Charles St, Louisville, KY", time: "8 PM", doors: "7 PM", category: "Food & Drink", emoji: "🍺", tags: ["Trivia", "Free"], free: true, price: "Free", desc: "One of Louisville's best neighborhood bars hosts weekly trivia every Thursday. Grab a team, order drinks, and compete for glory." },
  { id: 2, day: 0, title: "Louisville City FC Watch Party", venue: "Play Louisville", address: "1 S 4th St, Louisville, KY", time: "7:30 PM", doors: "7 PM", category: "Sports", emoji: "⚽", tags: ["Soccer", "Free"], free: true, price: "Free", desc: "Watch Louisville City FC live on the big screens with hundreds of fellow supporters. Drink specials all night." },
  { id: 3, day: 0, title: "Comedy Open Mic", venue: "The Bard's Town", address: "1801 Bardstown Rd, Louisville, KY", time: "8 PM", doors: "7:30 PM", category: "Arts", emoji: "🎭", tags: ["Comedy", "Free"], free: true, price: "Free", desc: "Local comedians take the mic every Thursday at this beloved NuLu theater. Always unpredictable, always entertaining." },
  { id: 4, day: 0, title: "Sunset Kayak on the Ohio", venue: "Waterfront Park", address: "129 Riverview Plaza, Louisville, KY", time: "6:30 PM", doors: "6 PM", category: "Outdoors", emoji: "🛶", tags: ["Outdoors", "Active"], free: false, price: "$35", ticketUrl: sgLink("Sunset Kayak Louisville"), ticketLabel: "🛶 Book Now", desc: "Guided sunset kayak tour along the Ohio River with stunning views of the Louisville skyline. Beginner friendly." },
  { id: 5, day: 1, title: "NuLu Art Walk", venue: "NuLu District", address: "Market St & Shelby St, Louisville, KY", time: "6 PM", doors: "6 PM", category: "Arts", emoji: "🎨", tags: ["Art", "Free", "Outdoors"], free: true, featured: true, price: "Free", desc: "Louisville's creative district opens its gallery doors for a free self-guided art walk. Over 20 galleries, live music, and food vendors." },
  { id: 6, day: 1, title: "Friday Night Jazz", venue: "21c Museum Hotel", address: "700 W Main St, Louisville, KY", time: "7 PM", doors: "6:30 PM", category: "Music", emoji: "🎷", tags: ["Jazz", "Free"], free: true, price: "Free", reservationUrl: otLink("21c Museum Hotel Louisville"), desc: "Live jazz in the stunning lobby of 21c Museum Hotel, surrounded by contemporary art. No cover, but come early." },
  { id: 7, day: 1, title: "Louisville Bats Baseball", venue: "Louisville Slugger Field", address: "401 E Main St, Louisville, KY", time: "7:05 PM", doors: "5:30 PM", category: "Sports", emoji: "⚾", tags: ["Baseball", "Family"], free: false, price: "$10-$18", ticketUrl: sgLink("Louisville Bats"), ticketLabel: "⚾ Buy Tickets", desc: "The Louisville Bats play at one of the most beautiful minor league ballparks in America." },
  { id: 8, day: 1, title: "Butchertown Pizza Crawl", venue: "Butchertown", address: "Butchertown Neighborhood, Louisville, KY", time: "7 PM", doors: "7 PM", category: "Food & Drink", emoji: "🍕", tags: ["Food", "Social"], free: false, price: "$20", ticketUrl: sgLink("Butchertown Pizza Crawl Louisville"), ticketLabel: "🍕 Get Tickets", desc: "Hit four of Butchertown's best pizza spots in one night. Ticket includes a slice at each stop plus one drink." },
  { id: 9, day: 2, title: "Forecastle Pre-Party", venue: "Headliners Music Hall", address: "1386 Lexington Rd, Louisville, KY", time: "8 PM", doors: "7 PM", category: "Music", emoji: "🎵", tags: ["Live Music", "Hot 🔥"], free: false, featured: true, price: "$12", ticketUrl: sgLink("Headliners Music Hall Louisville"), ticketLabel: "🎟 Get Tickets", desc: "Kick off Forecastle weekend with local and regional acts at one of Louisville's most iconic music venues." },
  { id: 10, day: 2, title: "Lynn's Paradise Cafe Brunch", venue: "Lynn's Paradise Cafe", address: "984 Barret Ave, Louisville, KY", time: "10 AM", doors: "10 AM", category: "Food & Drink", emoji: "🥞", tags: ["Brunch", "Iconic"], free: false, price: "$15-$30", reservationUrl: otLink("Lynn's Paradise Cafe Louisville"), reservationLabel: "🥞 Reserve a Table", desc: "Beloved Louisville institution known for its wild decor, massive portions, and legendary brunch menu." },
  { id: 11, day: 2, title: "Cherokee Park Trail Run", venue: "Cherokee Park", address: "745 Cochran Hill Rd, Louisville, KY", time: "8 AM", doors: "8 AM", category: "Outdoors", emoji: "🏃", tags: ["Running", "Free"], free: true, price: "Free", desc: "Community trail run through the scenic Olmsted-designed Cherokee Park. All paces welcome." },
  { id: 12, day: 2, title: "Speed Art Museum Late Night", venue: "Speed Art Museum", address: "2035 S 3rd St, Louisville, KY", time: "6 PM", doors: "6 PM", category: "Arts", emoji: "🖼", tags: ["Art", "Cocktails"], free: false, price: "$10", ticketUrl: sgLink("Speed Art Museum Louisville"), ticketLabel: "🎟 Get Tickets", desc: "Kentucky's oldest and largest art museum stays open late with a curated cocktail menu and live music." },
  { id: 13, day: 3, title: "Bourbon & BBQ Festival", venue: "Slugger Field Parking Lot", address: "401 E Main St, Louisville, KY", time: "2 PM", doors: "2 PM", category: "Food & Drink", emoji: "🥃", tags: ["Bourbon", "BBQ", "Hot 🔥"], free: false, featured: true, price: "$25", ticketUrl: sgLink("Bourbon BBQ Festival Louisville"), ticketLabel: "🥃 Get Tickets", desc: "20+ Kentucky distilleries and 10 BBQ pitmasters for Louisville's premier outdoor tasting event." },
  { id: 14, day: 3, title: "Sunday Gospel Brunch", venue: "The Brown Hotel", address: "335 W Broadway, Louisville, KY", time: "11 AM", doors: "11 AM", category: "Food & Drink", emoji: "🎶", tags: ["Brunch", "Music"], free: false, price: "$45", reservationUrl: otLink("The Brown Hotel Louisville"), reservationLabel: "🍽 Reserve a Table", desc: "The iconic Brown Hotel hosts a lavish Sunday Gospel Brunch with live gospel music and bottomless mimosas." },
  { id: 15, day: 3, title: "Waterfront Sunday Concert", venue: "Waterfront Park", address: "129 Riverview Plaza, Louisville, KY", time: "4 PM", doors: "3:30 PM", category: "Music", emoji: "🌅", tags: ["Outdoor Concert", "Free"], free: true, price: "Free", desc: "Free outdoor concert series at Waterfront Park with views of the Ohio River and the Big Four Bridge." },
  { id: 16, day: 4, title: "Monday Bluegrass Jam", venue: "Zanzabar", address: "2100 S Preston St, Louisville, KY", time: "9 PM", doors: "8 PM", category: "Music", emoji: "🪕", tags: ["Bluegrass", "Free"], free: true, featured: true, price: "Free", desc: "One of Louisville's best dive bars hosts an open bluegrass jam every Monday. All welcome." },
  { id: 17, day: 4, title: "Louisville Trivia League", venue: "Against the Grain Brewery", address: "401 E Main St, Louisville, KY", time: "7 PM", doors: "6:30 PM", category: "Food & Drink", emoji: "🍻", tags: ["Trivia", "Beer"], free: false, price: "$5/team", reservationUrl: otLink("Against the Grain Brewery Louisville"), reservationLabel: "🍺 Reserve a Spot", desc: "Against the Grain's weekly trivia league. Winner gets a tab." },
  { id: 18, day: 5, title: "KFC Yum! Center Concert", venue: "KFC Yum! Center", address: "1 Arena Plaza, Louisville, KY", time: "8 PM", doors: "7 PM", category: "Music", emoji: "🎤", tags: ["Concert", "Big Venue"], free: false, featured: true, price: "$45-$120", ticketUrl: sgLink("KFC Yum Center Louisville"), ticketLabel: "🎟 Get Tickets", desc: "A major touring act takes the stage at Louisville's premier 22,000-seat arena." },
  { id: 19, day: 5, title: "St. Charles Exchange Whiskey Dinner", venue: "St. Charles Exchange", address: "113 S 7th St, Louisville, KY", time: "6:30 PM", doors: "6 PM", category: "Food & Drink", emoji: "🥃", tags: ["Whiskey", "Dinner"], free: false, price: "$85", reservationUrl: otLink("St Charles Exchange Louisville"), reservationLabel: "🥃 Reserve a Seat", desc: "An intimate five-course dinner paired with rare Kentucky whiskies at one of downtown Louisville's finest bars." },
  { id: 20, day: 5, title: "Bernheim Forest Night Hike", venue: "Bernheim Forest", address: "2499 Clermont Rd, Clermont, KY", time: "7 PM", doors: "6:45 PM", category: "Outdoors", emoji: "🌲", tags: ["Hiking", "Nature"], free: false, price: "$10", ticketUrl: sgLink("Bernheim Forest Night Hike"), ticketLabel: "🌲 Book Now", desc: "A guided 2-mile night hike through Bernheim Arboretum and Research Forest. Headlamps provided." },
  { id: 21, day: 6, title: "Louisville Roller Derby", venue: "Expo 5", address: "4100 Brookside Dr, Louisville, KY", time: "6 PM", doors: "5 PM", category: "Sports", emoji: "🛼", tags: ["Derby", "Hot 🔥"], free: false, featured: true, price: "$12", ticketUrl: sgLink("Louisville Roller Derby"), ticketLabel: "🛼 Buy Tickets", desc: "The Bleeding Hearts Bout Squad in a high-energy, full-contact roller derby bout." },
  { id: 22, day: 6, title: "Bardstown Road Farmers Market", venue: "Bardstown Road", address: "1722 Bardstown Rd, Louisville, KY", time: "9 AM", doors: "9 AM", category: "Food & Drink", emoji: "🥬", tags: ["Market", "Free"], free: true, price: "Free", desc: "Weekly outdoor farmers market along Louisville's most beloved corridor. Local produce, artisan goods, fresh flowers." },
  { id: 23, day: 6, title: "Open Studios Tour", venue: "Portland Neighborhood", address: "Portland Ave, Louisville, KY", time: "12 PM", doors: "12 PM", category: "Arts", emoji: "🎨", tags: ["Art", "Free"], free: true, price: "Free", desc: "Artists in Louisville's historic Portland neighborhood open their studios for free public tours." },
];

const SEED_MAJOR = [
  { id: "m0", day: 0, title: "Tyler Childers", venue: "KFC Yum! Center", address: "1 Arena Plaza, Louisville, KY", time: "8 PM", doors: "7 PM", emoji: "🎤", price: "$55-$135", ticketUrl: sgLink("Tyler Childers"), altTicketUrl: shLink("Tyler Childers"), desc: "Kentucky's own Tyler Childers brings his raw Appalachian sound to the Yum! Center." },
  { id: "m1", day: 0, title: "Louisville Cardinals Basketball", venue: "KFC Yum! Center", address: "1 Arena Plaza, Louisville, KY", time: "7 PM", doors: "5:30 PM", emoji: "🏀", price: "$22-$80", ticketUrl: sgLink("Louisville Cardinals Basketball"), altTicketUrl: shLink("Louisville Cardinals Basketball"), desc: "The Louisville Cardinals tip off at home. 22,000 red-and-black faithful." },
  { id: "m2", day: 1, title: "Post Malone", venue: "KFC Yum! Center", address: "1 Arena Plaza, Louisville, KY", time: "8:30 PM", doors: "7 PM", emoji: "🎶", price: "$65-$200", ticketUrl: sgLink("Post Malone"), altTicketUrl: shLink("Post Malone"), desc: "Post Malone's world tour rolls into Louisville. Full production and pyrotechnics." },
  { id: "m3", day: 1, title: "Louisville City FC", venue: "Lynn Family Stadium", address: "350 Adams St, Louisville, KY", time: "7:30 PM", doors: "6 PM", emoji: "⚽", price: "$15-$45", ticketUrl: sgLink("Louisville City FC"), altTicketUrl: shLink("Louisville City FC"), desc: "LouCity FC host a conference rival at Lynn Family Stadium." },
  { id: "m4", day: 2, title: "Zac Brown Band", venue: "Rupp Arena", address: "430 W Vine St, Lexington, KY", time: "7:30 PM", doors: "6 PM", emoji: "🎸", price: "$45-$110", ticketUrl: sgLink("Zac Brown Band"), altTicketUrl: shLink("Zac Brown Band"), desc: "About an hour from Louisville, the Zac Brown Band hits Rupp Arena." },
  { id: "m5", day: 3, title: "Louisville Bats vs Memphis", venue: "Louisville Slugger Field", address: "401 E Main St, Louisville, KY", time: "2:05 PM", doors: "12:30 PM", emoji: "⚾", price: "$11-$19", ticketUrl: sgLink("Louisville Bats"), altTicketUrl: shLink("Louisville Bats"), desc: "Sunday afternoon baseball at one of America's best minor league parks." },
  { id: "m6", day: 4, title: "Hozier", venue: "Brown Theatre", address: "315 W Broadway, Louisville, KY", time: "8 PM", doors: "7 PM", emoji: "🎵", price: "$50-$95", ticketUrl: sgLink("Hozier"), altTicketUrl: shLink("Hozier"), desc: "Hozier performs an intimate Monday night set at the historic Brown Theatre." },
  { id: "m7", day: 5, title: "Billie Eilish", venue: "KFC Yum! Center", address: "1 Arena Plaza, Louisville, KY", time: "8 PM", doors: "6:30 PM", emoji: "🌙", price: "$70-$220", ticketUrl: sgLink("Billie Eilish"), altTicketUrl: shLink("Billie Eilish"), desc: "Billie Eilish's HIT ME HARD AND SOFT tour comes to Louisville." },
  { id: "m8", day: 6, title: "Louisville Cardinals Football", venue: "L&N Federal Credit Union Stadium", address: "2800 S Floyd St, Louisville, KY", time: "3:30 PM", doors: "1 PM", emoji: "🏈", price: "$30-$85", ticketUrl: sgLink("Louisville Cardinals Football"), altTicketUrl: shLink("Louisville Cardinals Football"), desc: "The Cards host a home game. Arrive before noon for tailgates." },
];

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const FULL_DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const CATEGORIES = ["Music","Food & Drink","Sports","Arts","Outdoors"];
const EMOJIS = ["🎸","🍺","⚽","🎨","🛶","🎷","⚾","🍕","🎵","🥞","🏃","🖼","🥃","🎶","🌅","🪕","🍻","🎤","🌲","🛼","🥬","🎭","🏀","🎸","🌙","🏈"];
const gradientMap = {
  Music:"linear-gradient(135deg,#1a0a1a,#2d0d2d)",
  "Food & Drink":"linear-gradient(135deg,#1a1000,#2d1e00)",
  Sports:"linear-gradient(135deg,#001a0d,#002d18)",
  Arts:"linear-gradient(135deg,#0d0d1a,#15152d)",
  Outdoors:"linear-gradient(135deg,#001a0a,#0a2d10)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
  .lml *{box-sizing:border-box;margin:0;padding:0;scrollbar-width:none;-ms-overflow-style:none;}
  .lml *::-webkit-scrollbar{display:none;}
  .lml{background:#0a0a0a;color:#f0ede8;font-family:'DM Sans',sans-serif;min-height:600px;position:relative;overflow:hidden;border-radius:12px;}
  .lml-hdr{padding:20px 24px 0;position:sticky;top:0;z-index:10;background:linear-gradient(to bottom,#0a0a0a 80%,transparent);}
  .lml-htop{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
  .lml-logo{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:2px;line-height:1;}
  .lml-logo span{color:#ff4d00;}
  .lml-badge{display:flex;align-items:center;gap:6px;background:#1c1c1c;border:1px solid #222;border-radius:20px;padding:6px 12px;font-size:13px;font-weight:500;}
  .lml-dot{width:7px;height:7px;background:#4caf50;border-radius:50%;animation:lmlpulse 2s infinite;}
  @keyframes lmlpulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(1.3);}}
  .lml-strip{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-bottom:4px;}
  .lml-dp{flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:8px 14px;border-radius:14px;border:1px solid #222;background:#141414;cursor:pointer;transition:all .2s;min-width:56px;}
  .lml-dp.active{background:#ff4d00;border-color:#ff4d00;}
  .lml-dp .dn{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:1px;color:#6b6b6b;margin-bottom:2px;}
  .lml-dp.active .dn{color:rgba(255,255,255,.7);}
  .lml-dp .dd{font-family:'Bebas Neue',sans-serif;font-size:22px;line-height:1;}
  .lml-dp.td::after{content:'';display:block;width:4px;height:4px;background:#ffb800;border-radius:50%;margin-top:3px;}
  .lml-dp.active.td::after{background:white;}
  .lml-chips{display:flex;gap:8px;overflow-x:auto;padding:12px 24px 0;}
  .lml-chip{flex-shrink:0;padding:6px 14px;border-radius:20px;border:1px solid #222;background:transparent;color:#6b6b6b;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;}
  .lml-chip.active{background:#1c1c1c;color:#ff4d00;border-color:#ff4d00;}
  .lml-body{padding:20px 24px 100px;overflow-y:auto;max-height:calc(100vh - 200px);}
  .lml-slbl{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:#6b6b6b;margin-bottom:12px;}
  .lml-feat{position:relative;border-radius:20px;overflow:hidden;margin-bottom:24px;height:220px;background:linear-gradient(135deg,#1a0a00 0%,#2d1500 50%,#0a1a2d 100%);border:1px solid #222;cursor:pointer;}
  .lml-feat-bg{position:absolute;inset:0;opacity:.15;font-size:160px;display:flex;align-items:center;justify-content:flex-end;padding-right:20px;line-height:1;user-select:none;}
  .lml-feat-cnt{position:relative;z-index:2;padding:24px;height:100%;display:flex;flex-direction:column;justify-content:flex-end;}
  .lml-feat-tag{display:inline-flex;align-items:center;gap:5px;background:#ff4d00;color:white;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;padding:4px 10px;border-radius:6px;margin-bottom:10px;width:fit-content;}
  .lml-feat-title{font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:1px;line-height:1;margin-bottom:8px;}
  .lml-feat-meta{display:flex;gap:16px;font-size:13px;color:rgba(240,237,232,.7);}
  .lml-free-sec{margin-bottom:28px;}
  .lml-free-hdr{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
  .lml-free-ttl{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:#4caf50;}
  .lml-free-line{flex:1;height:1px;background:linear-gradient(to right,rgba(76,175,80,.3),transparent);}
  .lml-free-scroll{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;}
  .lml-fc{flex-shrink:0;width:160px;background:linear-gradient(135deg,#0a1a0a,#0f200f);border:1px solid rgba(76,175,80,.25);border-radius:16px;padding:14px;cursor:pointer;transition:all .2s;}
  .lml-fc:hover{border-color:rgba(76,175,80,.5);transform:translateY(-2px);}
  .lml-fbadge{display:inline-block;background:rgba(76,175,80,.15);color:#4caf50;border:1px solid rgba(76,175,80,.3);font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;padding:2px 8px;border-radius:6px;margin-bottom:8px;}
  .lml-fce{font-size:28px;margin-bottom:8px;}
  .lml-fct{font-size:13px;font-weight:500;line-height:1.3;margin-bottom:6px;}
  .lml-fcv{font-size:11px;color:#6b6b6b;margin-bottom:6px;}
  .lml-fctm{font-size:11px;font-weight:600;color:#4caf50;}
  .lml-maj-sec{margin-bottom:28px;}
  .lml-maj-hdr{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
  .lml-maj-ttl{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:#ffb800;white-space:nowrap;}
  .lml-maj-line{flex:1;height:1px;background:linear-gradient(to right,rgba(255,184,0,.3),transparent);}
  .lml-maj-scroll{display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;}
  .lml-mc{flex-shrink:0;width:220px;border-radius:18px;overflow:hidden;border:1px solid rgba(255,184,0,.2);cursor:pointer;transition:all .2s;background:linear-gradient(160deg,#1a1200,#0f0a00);}
  .lml-mc:hover{border-color:rgba(255,184,0,.45);transform:translateY(-2px);}
  .lml-mc-hero{height:110px;display:flex;align-items:center;justify-content:center;font-size:64px;position:relative;overflow:hidden;}
  .lml-mc-hero-bg{position:absolute;inset:0;opacity:.08;font-size:120px;display:flex;align-items:center;justify-content:center;}
  .lml-mc-emoji{position:relative;z-index:2;filter:drop-shadow(0 4px 12px rgba(0,0,0,.5));}
  .lml-mc-price{position:absolute;top:10px;right:10px;background:#ffb800;color:#000;font-size:10px;font-weight:700;padding:3px 8px;border-radius:8px;}
  .lml-mc-body{padding:12px 14px 14px;}
  .lml-mc-venue{font-size:10px;color:#ffb800;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:4px;}
  .lml-mc-title{font-size:14px;font-weight:600;line-height:1.3;margin-bottom:8px;}
  .lml-mc-meta{display:flex;align-items:center;justify-content:space-between;}
  .lml-mc-time{font-size:12px;color:#6b6b6b;}
  .lml-mc-btn{font-size:11px;font-weight:600;background:rgba(255,184,0,.15);color:#ffb800;border:1px solid rgba(255,184,0,.3);border-radius:8px;padding:4px 10px;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .lml-list{display:flex;flex-direction:column;gap:12px;}
  .lml-ec{background:#141414;border:1px solid #222;border-radius:16px;padding:16px;display:flex;gap:14px;cursor:pointer;transition:all .2s;animation:lmlup .4s ease both;}
  .lml-ec:hover{border-color:#333;background:#1c1c1c;transform:translateY(-1px);}
  @keyframes lmlup{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
  .lml-etc{display:flex;flex-direction:column;align-items:center;min-width:44px;}
  .lml-ee{font-size:28px;margin-bottom:4px;}
  .lml-et{font-size:11px;font-weight:600;color:#ffb800;text-align:center;line-height:1.2;}
  .lml-ei{flex:1;}
  .lml-etitle{font-weight:500;font-size:15px;margin-bottom:4px;line-height:1.3;}
  .lml-evenue{font-size:13px;color:#6b6b6b;margin-bottom:8px;}
  .lml-etags{display:flex;gap:6px;flex-wrap:wrap;}
  .lml-tag{font-size:11px;padding:2px 8px;border-radius:6px;background:#1c1c1c;color:#6b6b6b;border:1px solid #222;}
  .lml-tag.free{color:#4caf50;border-color:rgba(76,175,80,.3);background:rgba(76,175,80,.08);}
  .lml-tag.hot{color:#ff4d00;border-color:rgba(255,77,0,.3);background:rgba(255,77,0,.08);}
  .lml-earrow{display:flex;align-items:center;color:#6b6b6b;font-size:18px;align-self:center;}
  .lml-cnt{display:inline-block;background:#ff4d00;color:white;font-size:11px;font-weight:600;border-radius:10px;padding:2px 7px;margin-left:6px;vertical-align:middle;}
  .lml-nav{position:sticky;bottom:0;background:rgba(10,10,10,.95);backdrop-filter:blur(20px);border-top:1px solid #222;display:flex;padding:12px 0 8px;z-index:10;}
  .lml-ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:1px;color:#6b6b6b;cursor:pointer;}
  .lml-ni.active{color:#ff4d00;}
  .lml-niicon{font-size:20px;}
  .lml-empty{text-align:center;padding:40px 20px;color:#6b6b6b;}
  .lml-empty-icon{font-size:48px;margin-bottom:12px;}
  .lml-empty-title{font-family:'Bebas Neue',sans-serif;font-size:24px;color:#f0ede8;margin-bottom:6px;}
  .lml-overlay{position:absolute;inset:0;background:rgba(0,0,0,.7);z-index:20;opacity:0;pointer-events:none;transition:opacity .3s;backdrop-filter:blur(4px);border-radius:12px;}
  .lml-overlay.open{opacity:1;pointer-events:all;}
  .lml-sheet{position:absolute;bottom:0;left:0;right:0;z-index:21;background:#111;border-radius:28px 28px 0 0;border-top:1px solid #222;transform:translateY(100%);transition:transform .4s cubic-bezier(.32,.72,0,1);max-height:85%;overflow-y:auto;}
  .lml-sheet.open{transform:translateY(0);}
  .lml-shdl{width:40px;height:4px;background:#333;border-radius:2px;margin:14px auto 0;}
  .lml-shhero{position:relative;height:200px;margin:16px 20px 0;border-radius:20px;overflow:hidden;display:flex;align-items:flex-end;padding:20px;}
  .lml-shhero-bg{position:absolute;inset:0;font-size:140px;display:flex;align-items:center;justify-content:center;opacity:.12;user-select:none;}
  .lml-shhero-cnt{position:relative;z-index:2;width:100%;}
  .lml-sh-cat{display:inline-block;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;padding:3px 10px;border-radius:6px;background:#ff4d00;color:white;margin-bottom:8px;}
  .lml-sh-title{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:1px;line-height:1;}
  .lml-sh-body{padding:20px 20px 40px;}
  .lml-inforow{display:flex;gap:10px;margin-bottom:20px;}
  .lml-infopill{flex:1;background:#141414;border:1px solid #222;border-radius:14px;padding:12px;text-align:center;}
  .lml-infopill .pico{font-size:20px;margin-bottom:4px;}
  .lml-infopill .plbl{font-size:10px;color:#6b6b6b;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;}
  .lml-infopill .pval{font-size:13px;font-weight:500;}
  .lml-sh-desc{font-size:14px;line-height:1.7;color:rgba(240,237,232,.75);margin-bottom:20px;}
  .lml-sh-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;}
  .lml-sh-tag{font-size:12px;padding:5px 12px;border-radius:20px;background:#1c1c1c;border:1px solid #222;color:#6b6b6b;}
  .lml-sh-stitle{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:#6b6b6b;margin-bottom:10px;}
  .lml-map{background:#141414;border:1px solid #222;border-radius:16px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:center;gap:12px;cursor:pointer;}
  .lml-sh-actions{display:flex;gap:10px;margin-bottom:10px;}
  .lml-btn-p{flex:1;padding:16px;border-radius:16px;background:#ff4d00;color:white;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;border:none;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px;}
  .lml-btn-p:hover{opacity:.9;}
  .lml-btn-p.gold{background:#ffb800;color:#000;}
  .lml-btn-alt{flex:1;padding:14px;border-radius:16px;background:#1a1a1a;color:#aaa;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;border:1px solid #2a2a2a;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px;}
  .lml-btn-s{width:56px;height:56px;border-radius:16px;background:#141414;border:1px solid #222;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .lml-btn-s.saved{border-color:#ffb800;background:rgba(255,184,0,.1);}
  .lml-disclosure{font-size:11px;color:#444;text-align:center;margin-top:8px;line-height:1.5;}
  .lml-hotel-banner{background:linear-gradient(135deg,#0a1020,#101828);border:1px solid rgba(100,140,255,.2);border-radius:16px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:center;gap:12px;cursor:pointer;text-decoration:none;}

  /* ADMIN PANEL */
  .adm{padding:20px 20px 100px;}
  .adm-title{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:2px;margin-bottom:4px;}
  .adm-sub{font-size:12px;color:#6b6b6b;margin-bottom:20px;}
  .adm-tabs{display:flex;gap:8px;margin-bottom:20px;}
  .adm-tab{padding:8px 16px;border-radius:20px;border:1px solid #222;background:transparent;color:#6b6b6b;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;}
  .adm-tab.active{background:#ff4d00;border-color:#ff4d00;color:white;}
  .adm-card{background:#141414;border:1px solid #222;border-radius:14px;padding:14px;margin-bottom:10px;display:flex;align-items:center;gap:12px;}
  .adm-card-info{flex:1;min-width:0;}
  .adm-card-title{font-size:14px;font-weight:500;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .adm-card-meta{font-size:11px;color:#6b6b6b;}
  .adm-card-actions{display:flex;gap:6px;flex-shrink:0;}
  .adm-btn{padding:6px 12px;border-radius:8px;border:1px solid #333;background:transparent;color:#aaa;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;}
  .adm-btn:hover{border-color:#555;color:#f0ede8;}
  .adm-btn.danger:hover{border-color:#ff4d00;color:#ff4d00;}
  .adm-btn.primary{background:#ff4d00;border-color:#ff4d00;color:white;}
  .adm-form{background:#141414;border:1px solid #333;border-radius:16px;padding:20px;margin-bottom:16px;}
  .adm-form-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:1px;margin-bottom:16px;color:#ff4d00;}
  .adm-field{margin-bottom:14px;}
  .adm-label{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:1px;color:#6b6b6b;margin-bottom:6px;display:block;}
  .adm-input{width:100%;background:#0a0a0a;border:1px solid #333;border-radius:10px;padding:10px 12px;color:#f0ede8;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;}
  .adm-input:focus{border-color:#ff4d00;}
  .adm-select{width:100%;background:#0a0a0a;border:1px solid #333;border-radius:10px;padding:10px 12px;color:#f0ede8;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;}
  .adm-row{display:flex;gap:10px;}
  .adm-row .adm-field{flex:1;}
  .adm-toggle{display:flex;align-items:center;gap:10px;}
  .adm-toggle-box{width:44px;height:24px;border-radius:12px;background:#222;border:1px solid #333;cursor:pointer;position:relative;transition:background .2s;}
  .adm-toggle-box.on{background:#ff4d00;border-color:#ff4d00;}
  .adm-toggle-knob{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:white;transition:transform .2s;}
  .adm-toggle-box.on .adm-toggle-knob{transform:translateX(20px);}
  .adm-emoji-grid{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
  .adm-emoji-opt{font-size:22px;cursor:pointer;padding:4px;border-radius:8px;border:2px solid transparent;}
  .adm-emoji-opt.sel{border-color:#ff4d00;background:rgba(255,77,0,.1);}
  .adm-form-actions{display:flex;gap:10px;margin-top:16px;}
  .adm-feat-row{display:flex;align-items:center;justify-content:space-between;background:#141414;border:1px solid #222;border-radius:12px;padding:12px 14px;margin-bottom:8px;}
`;

const BLANK_EVENT = { title:"", venue:"", address:"", time:"", doors:"", category:"Music", emoji:"🎸", price:"", free:false, featured:false, desc:"", day:0, tags:[] };

export default function App() {
  const today = new Date();
  const days = Array.from({length:7},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()+i);return d;});

  const [selDate, setSelDate] = useState(0);
  const [selFilter, setSelFilter] = useState("All");
  const [nav, setNav] = useState("Events");
  const [sheet, setSheet] = useState(null);
  const [saved, setSaved] = useState(new Set());

  // Secret admin access — tap logo 5x then enter PIN
  const ADMIN_PIN = "1017";
  const [logoTaps, setLogoTaps] = useState(0);
  const tapTimerRef = useState({current:null});
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const tapTimer = useState({current: null})[0];
  const handleLogoTap = () => {
    const next = logoTaps + 1;
    setLogoTaps(next);
    if (next >= 5) {
      clearTimeout(tapTimer.current);
      setLogoTaps(0);
      setShowPinEntry(true);
      setPinInput("");
      setPinError(false);
      return;
    }
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setLogoTaps(0), 600);
  };
  const submitPin = () => {
    if (pinInput === ADMIN_PIN) { setAdminUnlocked(true); setShowPinEntry(false); setNav("Admin"); }
    else { setPinError(true); setPinInput(""); setTimeout(()=>setPinError(false),1500); }
  };

  // All event state — editable
  const [events, setEvents] = useState(SEED_EVENTS);
  const [majorEvts, setMajorEvts] = useState(SEED_MAJOR);

  // AI event generation
  const [aiLoading, setAiLoading] = useState(false);
  const aiLoadedRef = useRef(false);

  useEffect(() => {
    if (aiLoadedRef.current) return;
    aiLoadedRef.current = true;
    generateAiEvents();
  }, []);

  const generateAiEvents = async () => {
    setAiLoading(true);
    const today = new Date();
    const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const prompt = `You are a Louisville, KY local events expert. Generate 12 realistic, specific, and varied local events happening in Louisville this week (today is ${dayNames[today.getDay()]}). Spread them across all 7 days (day 0 = today, day 6 = 6 days from now).

Return ONLY a valid JSON array. Each event must have exactly these fields:
- title: string
- venue: string (real Louisville venue)
- address: string (real Louisville address)
- time: string (e.g. "8 PM")
- doors: string (e.g. "7 PM")  
- category: one of exactly ["Music","Food & Drink","Sports","Arts","Outdoors"]
- emoji: single emoji character
- price: string (e.g. "Free" or "$15-$25")
- free: boolean
- day: number 0-6
- desc: string (2 sentences, vivid and specific)
- tags: array of 1-3 short strings

Return only the JSON array, no markdown, no explanation.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const withIds = parsed.map((e, i) => ({
        ...e,
        id: `ai_${Date.now()}_${i}`,
        ticketUrl: e.free ? undefined : sgLink(e.title),
        ticketLabel: e.free ? undefined : "🎟 Get Tickets",
        reservationUrl: e.category === "Food & Drink" ? otLink(e.venue) : undefined,
        reservationLabel: e.category === "Food & Drink" ? "🍽 Reserve a Table" : undefined,
      }));
      setEvents(prev => [...prev, ...withIds]);
    } catch(err) {
      console.error("AI event gen failed:", err);
    }
    setAiLoading(false);
  };

  // Admin state
  const [admTab, setAdmTab] = useState("events");
  const [editingEvent, setEditingEvent] = useState(null); // null = list, object = editing
  const [formData, setFormData] = useState(BLANK_EVENT);
  const [isNew, setIsNew] = useState(false);

  const toggleSave = (id) => setSaved(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});

  // Event list for current day/filter
  const dayEvts = events.filter(e=>e.day===selDate);
  const featured = dayEvts.find(e=>e.featured);
  const freeEvts = dayEvts.filter(e=>e.free);
  const dayMajor = majorEvts.filter(e=>e.day===selDate);
  let listEvts = dayEvts;
  if(selFilter==="Free") listEvts=dayEvts.filter(e=>e.free);
  else if(selFilter!=="All") listEvts=dayEvts.filter(e=>e.category===selFilter);
  if(selFilter==="All"&&featured) listEvts=listEvts.filter(e=>e!==featured);

  const filters=["All","Music","Food & Drink","Sports","Arts","Free","Outdoors"];
  const filterLabels={"All":"All","Music":"🎵 Music","Food & Drink":"🍺 Food & Drink","Sports":"🏅 Sports","Arts":"🎨 Arts","Free":"✨ Free","Outdoors":"🌿 Outdoors"};

  // Admin helpers
  const startNew = () => { setFormData({...BLANK_EVENT}); setIsNew(true); setEditingEvent("new"); };
  const startEdit = (e) => { setFormData({...e}); setIsNew(false); setEditingEvent(e.id); };
  const cancelEdit = () => { setEditingEvent(null); setFormData(BLANK_EVENT); };
  const deleteEvent = (id) => setEvents(prev=>prev.filter(e=>e.id!==id));
  const deleteMajor = (id) => setMajorEvts(prev=>prev.filter(e=>e.id!==id));
  const toggleFeatured = (id) => setEvents(prev=>prev.map(e=>e.id===id?{...e,featured:!e.featured}:e));

  const saveEvent = () => {
    if(!formData.title||!formData.venue) return;
    const ev = {
      ...formData,
      id: isNew ? Date.now() : formData.id,
      tags: formData.free ? [...(formData.tags||[]).filter(t=>t!=="Free"),"Free"] : (formData.tags||[]).filter(t=>t!=="Free"),
      ticketUrl: formData.ticketUrl || (formData.title ? sgLink(formData.title) : undefined),
    };
    if(isNew) setEvents(prev=>[...prev,ev]);
    else setEvents(prev=>prev.map(e=>e.id===ev.id?ev:e));
    cancelEdit();
  };

  const Field = ({label,field,placeholder,type="text"}) => (
    <div className="adm-field">
      <label className="adm-label">{label}</label>
      <input className="adm-input" type={type} placeholder={placeholder||label} value={formData[field]||""} onChange={e=>setFormData(p=>({...p,[field]:e.target.value}))}/>
    </div>
  );

  return (
    <div className="lml">
      <style>{css}</style>

      {/* HEADER — hidden on admin */}
      {nav !== "Admin" && (
        <>
          <div className="lml-hdr">
            <div className="lml-htop">
              <div className="lml-logo" onClick={handleLogoTap} style={{cursor:"default",userSelect:"none"}}>Last Minute<span>LOU</span></div>
              <div className="lml-badge">
                <span className="lml-dot"/>
                Louisville, KY
                {aiLoading && <span style={{fontSize:10,color:"#ffb800",marginLeft:4}}>✦</span>}
              </div>
            </div>
            <div className="lml-strip">
              {days.map((d,i)=>(
                <div key={i} className={`lml-dp${i===0?" td":""}${i===selDate?" active":""}`} onClick={()=>{setSelDate(i);setSelFilter("All");}}>
                  <span className="dn">{i===0?"Today":DAY_NAMES[d.getDay()]}</span>
                  <span className="dd">{d.getDate()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lml-chips">
            {filters.map(f=>(
              <button key={f} className={`lml-chip${selFilter===f?" active":""}`} onClick={()=>setSelFilter(f)}>{filterLabels[f]}</button>
            ))}
          </div>
        </>
      )}

      {/* EVENTS TAB */}
      {nav==="Events" && (
        <div className="lml-body">
          {featured&&selFilter==="All"&&(
            <>
              <p className="lml-slbl">Featured</p>
              <div className="lml-feat" onClick={()=>setSheet({event:featured,isMajor:false})}>
                <div className="lml-feat-bg">{featured.emoji}</div>
                <div className="lml-feat-cnt">
                  <div className="lml-feat-tag">⚡ Don't Miss</div>
                  <div className="lml-feat-title">{featured.title}</div>
                  <div className="lml-feat-meta"><span>📍 {featured.venue}</span><span>🕐 {featured.time}</span></div>
                </div>
              </div>
            </>
          )}
          {freeEvts.length>0&&selFilter!=="Free"&&(
            <div className="lml-free-sec">
              <div className="lml-free-hdr">
                <span className="lml-free-ttl">✨ Free Tonight <span style={{color:"#6b6b6b",fontSize:10}}>{freeEvts.length} events</span></span>
                <div className="lml-free-line"/>
              </div>
              <div className="lml-free-scroll">
                {freeEvts.map(e=>(
                  <div key={e.id} className="lml-fc" onClick={()=>setSheet({event:e,isMajor:false})}>
                    <div className="lml-fbadge">Free</div>
                    <div className="lml-fce">{e.emoji}</div>
                    <div className="lml-fct">{e.title}</div>
                    <div className="lml-fcv">📍 {e.venue}</div>
                    <div className="lml-fctm">🕐 {e.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {dayMajor.length>0&&selFilter==="All"&&(
            <div className="lml-maj-sec">
              <div className="lml-maj-hdr">
                <span className="lml-maj-ttl">🎟 Major Events <span style={{color:"#6b6b6b",fontSize:10}}>{dayMajor.length} shows</span></span>
                <div className="lml-maj-line"/>
              </div>
              <div className="lml-maj-scroll">
                {dayMajor.map(e=>(
                  <div key={e.id} className="lml-mc" onClick={()=>setSheet({event:e,isMajor:true})}>
                    <div className="lml-mc-hero">
                      <div className="lml-mc-hero-bg">{e.emoji}</div>
                      <div className="lml-mc-emoji">{e.emoji}</div>
                      <div className="lml-mc-price">{e.price.split("-")[0]}+</div>
                    </div>
                    <div className="lml-mc-body">
                      <div className="lml-mc-venue">{e.venue}</div>
                      <div className="lml-mc-title">{e.title}</div>
                      <div className="lml-mc-meta">
                        <span className="lml-mc-time">🕐 {e.time}</span>
                        <button className="lml-mc-btn" onClick={ev=>{ev.stopPropagation();setSheet({event:e,isMajor:true});}}>Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="lml-slbl">
            {selFilter==="Free"?"Free Events":selDate===0?"All Tonight":`${FULL_DAY_NAMES[days[selDate].getDay()]} Events`}
            <span className="lml-cnt">{listEvts.length}</span>
          </p>
          {listEvts.length===0?(
            <div className="lml-empty"><div className="lml-empty-icon">😴</div><div className="lml-empty-title">Nothing Here Yet</div><p>Try a different filter.</p></div>
          ):(
            <div className="lml-list">
              {listEvts.map((e,i)=>(
                <div key={e.id} className="lml-ec" style={{animationDelay:`${i*0.05}s`}} onClick={()=>setSheet({event:e,isMajor:false})}>
                  <div className="lml-etc"><div className="lml-ee">{e.emoji}</div><div className="lml-et">{e.time}</div></div>
                  <div className="lml-ei">
                    <div className="lml-etitle">{e.title}</div>
                    <div className="lml-evenue">📍 {e.venue}</div>
                    <div className="lml-etags">{(e.tags||[]).map(t=><span key={t} className={`lml-tag${t==="Free"?" free":t.includes("🔥")?" hot":""}`}>{t}</span>)}</div>
                  </div>
                  <div className="lml-earrow">›</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SAVED TAB */}
      {nav==="Saved"&&(
        <div className="lml-body">
          <p className="lml-slbl">Saved Events <span className="lml-cnt">{saved.size}</span></p>
          {saved.size===0?(
            <div className="lml-empty"><div className="lml-empty-icon">🔖</div><div className="lml-empty-title">Nothing Saved Yet</div><p>Tap the heart on any event to save it here.</p></div>
          ):(
            <div className="lml-list">
              {[...events,...majorEvts].filter(e=>saved.has(e.id)).map((e,i)=>(
                <div key={e.id} className="lml-ec" style={{animationDelay:`${i*0.05}s`}} onClick={()=>setSheet({event:e,isMajor:majorEvts.includes(e)})}>
                  <div className="lml-etc"><div className="lml-ee">{e.emoji}</div><div className="lml-et">{e.time}</div></div>
                  <div className="lml-ei"><div className="lml-etitle">{e.title}</div><div className="lml-evenue">📍 {e.venue}</div></div>
                  <div className="lml-earrow">›</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MAP TAB */}
      {nav==="Map"&&(
        <div className="lml-body">
          <div className="lml-empty"><div className="lml-empty-icon">🗺️</div><div className="lml-empty-title">Map Coming Soon</div><p>We're plotting all Louisville events on a map.</p></div>
        </div>
      )}

      {/* ADMIN TAB */}
      {nav==="Admin"&&(
        <div className="adm">
          <div className="adm-title">Admin Panel</div>
          <div className="adm-sub">Add, edit, or remove events from the app</div>

          <div className="adm-tabs">
            <button className={`adm-tab${admTab==="events"?" active":""}`} onClick={()=>{setAdmTab("events");cancelEdit();}}>Regular Events</button>
            <button className={`adm-tab${admTab==="major"?" active":""}`} onClick={()=>{setAdmTab("major");cancelEdit();}}>Major Events</button>
            <button className={`adm-tab${admTab==="featured"?" active":""}`} onClick={()=>{setAdmTab("featured");cancelEdit();}}>Featured</button>
          </div>

          {/* REGULAR EVENTS */}
          {admTab==="events"&&(
            <>
              {editingEvent===null?(
                <>
                  <button className="adm-btn primary" style={{marginBottom:16,width:"100%",padding:"12px"}} onClick={startNew}>+ Add New Event</button>
                  {events.map(e=>(
                    <div key={e.id} className="adm-card">
                      <div style={{fontSize:24}}>{e.emoji}</div>
                      <div className="adm-card-info">
                        <div className="adm-card-title">{e.title}</div>
                        <div className="adm-card-meta">Day {e.day+1} · {e.time} · {e.category} {e.featured?"⭐":""} {e.free?"✨ Free":""}</div>
                      </div>
                      <div className="adm-card-actions">
                        <button className="adm-btn" onClick={()=>startEdit(e)}>Edit</button>
                        <button className="adm-btn danger" onClick={()=>deleteEvent(e.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </>
              ):(
                <div className="adm-form">
                  <div className="adm-form-title">{isNew?"New Event":"Edit Event"}</div>
                  <Field label="Event Title" field="title" placeholder="e.g. Jazz Night at 21c"/>
                  <div className="adm-row">
                    <Field label="Time" field="time" placeholder="e.g. 8 PM"/>
                    <Field label="Doors" field="doors" placeholder="e.g. 7 PM"/>
                  </div>
                  <Field label="Venue" field="venue" placeholder="e.g. Mercury Ballroom"/>
                  <Field label="Address" field="address" placeholder="e.g. 614 W Main St, Louisville, KY"/>
                  <div className="adm-row">
                    <div className="adm-field">
                      <label className="adm-label">Category</label>
                      <select className="adm-select" value={formData.category||"Music"} onChange={e=>setFormData(p=>({...p,category:e.target.value}))}>
                        {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="adm-field">
                      <label className="adm-label">Day (0=Today)</label>
                      <select className="adm-select" value={formData.day||0} onChange={e=>setFormData(p=>({...p,day:parseInt(e.target.value)}))}>
                        {[0,1,2,3,4,5,6].map(i=><option key={i} value={i}>{i===0?"Today":DAY_NAMES[days[i]?.getDay()]||i}</option>)}
                      </select>
                    </div>
                  </div>
                  <Field label="Price" field="price" placeholder="e.g. Free or $15-$25"/>
                  <div className="adm-field">
                    <label className="adm-label">Description</label>
                    <textarea className="adm-input" rows={3} placeholder="Describe the event..." value={formData.desc||""} onChange={e=>setFormData(p=>({...p,desc:e.target.value}))} style={{resize:"none"}}/>
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">Pick an Emoji</label>
                    <div className="adm-emoji-grid">
                      {EMOJIS.map(em=>(
                        <span key={em} className={`adm-emoji-opt${formData.emoji===em?" sel":""}`} onClick={()=>setFormData(p=>({...p,emoji:em}))}>{em}</span>
                      ))}
                    </div>
                  </div>
                  <div className="adm-field">
                    <div className="adm-toggle" onClick={()=>setFormData(p=>({...p,free:!p.free}))}>
                      <div className={`adm-toggle-box${formData.free?" on":""}`}><div className="adm-toggle-knob"/></div>
                      <span style={{fontSize:14}}>This is a free event</span>
                    </div>
                  </div>
                  <div className="adm-field">
                    <div className="adm-toggle" onClick={()=>setFormData(p=>({...p,featured:!p.featured}))}>
                      <div className={`adm-toggle-box${formData.featured?" on":""}`}><div className="adm-toggle-knob"/></div>
                      <span style={{fontSize:14}}>Feature this event at the top</span>
                    </div>
                  </div>
                  <div className="adm-form-actions">
                    <button className="adm-btn primary" style={{flex:1,padding:"12px"}} onClick={saveEvent}>Save Event</button>
                    <button className="adm-btn" style={{flex:1,padding:"12px"}} onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* MAJOR EVENTS */}
          {admTab==="major"&&(
            <>
              <p style={{fontSize:12,color:"#6b6b6b",marginBottom:12}}>Major events link directly to SeatGeek & StubHub.</p>
              {majorEvts.map(e=>(
                <div key={e.id} className="adm-card">
                  <div style={{fontSize:24}}>{e.emoji}</div>
                  <div className="adm-card-info">
                    <div className="adm-card-title">{e.title}</div>
                    <div className="adm-card-meta">{e.venue} · Day {e.day+1} · {e.price}</div>
                  </div>
                  <div className="adm-card-actions">
                    <button className="adm-btn danger" onClick={()=>deleteMajor(e.id)}>✕ Remove</button>
                  </div>
                </div>
              ))}
              {majorEvts.length===0&&<div className="lml-empty"><div className="lml-empty-icon">🎟</div><div className="lml-empty-title">No Major Events</div></div>}
            </>
          )}

          {/* FEATURED MANAGEMENT */}
          {admTab==="featured"&&(
            <>
              <p style={{fontSize:12,color:"#6b6b6b",marginBottom:12}}>Toggle which events appear as Featured at the top of each day.</p>
              {events.map(e=>(
                <div key={e.id} className="adm-feat-row">
                  <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
                    <span style={{fontSize:20}}>{e.emoji}</span>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.title}</div>
                      <div style={{fontSize:11,color:"#6b6b6b"}}>Day {e.day+1} · {e.time}</div>
                    </div>
                  </div>
                  <div className={`adm-toggle-box${e.featured?" on":""}`} style={{marginLeft:12}} onClick={()=>toggleFeatured(e.id)}>
                    <div className="adm-toggle-knob"/>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className="lml-nav">
        {[["🗓","Events"],["🗺","Map"],["🔖","Saved"],...(adminUnlocked?[["⚙️","Admin"]]:[])] .map(([ic,lb])=>(
          <div key={lb} className={`lml-ni${nav===lb?" active":""}`} onClick={()=>setNav(lb)}>
            <span className="lml-niicon">{ic}</span>{lb}
          </div>
        ))}
      </nav>

      {/* PIN ENTRY MODAL */}
      {showPinEntry && (
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.85)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",borderRadius:12}}>
          <div style={{background:"#141414",border:"1px solid #333",borderRadius:24,padding:"32px 28px",width:"85%",maxWidth:320,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🔐</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2,marginBottom:6}}>Admin Access</div>
            <div style={{fontSize:13,color:"#6b6b6b",marginBottom:24}}>Enter your PIN to continue</div>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pinInput}
              onChange={e=>setPinInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submitPin()}
              placeholder="••••"
              autoFocus
              style={{width:"100%",background:"#0a0a0a",border:`1px solid ${pinError?"#ff4d00":"#333"}`,borderRadius:12,padding:"14px",color:"#f0ede8",fontSize:20,fontFamily:"'DM Sans',sans-serif",textAlign:"center",outline:"none",letterSpacing:6,marginBottom:8}}
            />
            {pinError && <div style={{fontSize:12,color:"#ff4d00",marginBottom:8}}>Incorrect PIN. Try again.</div>}
            <div style={{display:"flex",gap:10,marginTop:12}}>
              <button onClick={()=>setShowPinEntry(false)} style={{flex:1,padding:"12px",borderRadius:12,background:"transparent",border:"1px solid #333",color:"#aaa",fontFamily:"'DM Sans',sans-serif",fontSize:14,cursor:"pointer"}}>Cancel</button>
              <button onClick={submitPin} style={{flex:1,padding:"12px",borderRadius:12,background:"#ff4d00",border:"none",color:"white",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,cursor:"pointer"}}>Unlock</button>
            </div>
          </div>
        </div>
      )}

      <div className={`lml-overlay${sheet?" open":""}`} onClick={()=>setSheet(null)}/>
      <div className={`lml-sheet${sheet?" open":""}`}>
        <div className="lml-shdl"/>
        {sheet&&(()=>{
          const e=sheet.event;
          const isMajor=sheet.isMajor;
          const bg=gradientMap[e.category]||"linear-gradient(135deg,#1a0a00,#0a1a2d)";
          const isSaved=saved.has(e.id);
          return (
            <div>
              <div className="lml-shhero" style={{background:isMajor?"linear-gradient(135deg,#1a1200,#2d2000)":bg}}>
                <div className="lml-shhero-bg">{e.emoji}</div>
                <div className="lml-shhero-cnt">
                  <div className="lml-sh-cat" style={isMajor?{background:"#ffb800",color:"#000"}:{}}>{isMajor?"🎟 Major Event":e.category}</div>
                  <div className="lml-sh-title">{e.title}</div>
                </div>
              </div>
              <div className="lml-sh-body">
                <div className="lml-inforow">
                  {[["🕐","Starts",e.time],["🚪","Doors",e.doors||"—"],[e.free?"✨":"🎟","Price",e.price]].map(([ic,lb,val])=>(
                    <div key={lb} className="lml-infopill">
                      <div className="pico">{ic}</div><div className="plbl">{lb}</div>
                      <div className="pval" style={lb==="Price"?{color:e.free?"#4caf50":"#ffb800"}:{}}>{val}</div>
                    </div>
                  ))}
                </div>
                <p className="lml-sh-stitle">About</p>
                <p className="lml-sh-desc">{e.desc}</p>
                {e.tags&&<div className="lml-sh-tags">{e.tags.map(t=><span key={t} className="lml-sh-tag">{t}</span>)}</div>}
                <p className="lml-sh-stitle">Location</p>
                <div className="lml-map">
                  <div style={{fontSize:28}}>📍</div>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,marginBottom:2}}>{e.venue}</div><div style={{fontSize:12,color:"#6b6b6b"}}>{e.address}</div></div>
                  <div style={{color:"#6b6b6b",fontSize:18}}>›</div>
                </div>
                {isMajor&&(
                  <a href={bookingLink("Louisville Kentucky")} target="_blank" rel="noopener noreferrer" className="lml-hotel-banner">
                    <div style={{fontSize:28}}>🏨</div>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,marginBottom:2}}>Staying overnight?</div><div style={{fontSize:12,color:"#6b6b6b"}}>Find hotels near the venue on Booking.com</div></div>
                    <div style={{color:"#6b6b6b",fontSize:18}}>›</div>
                  </a>
                )}
                {isMajor&&(
                  <>
                    <p className="lml-sh-stitle">Tickets</p>
                    <div style={{background:"rgba(255,184,0,.06)",border:"1px solid rgba(255,184,0,.2)",borderRadius:14,padding:"14px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div><div style={{fontSize:12,color:"#6b6b6b",marginBottom:2}}>Price Range</div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"#ffb800",letterSpacing:1}}>{e.price}</div></div>
                      <div style={{fontSize:11,color:"#6b6b6b",textAlign:"right",lineHeight:1.5}}>Prices may vary<br/>by platform</div>
                    </div>
                  </>
                )}
                <div className="lml-sh-actions">
                  {isMajor?(
                    <><a href={e.ticketUrl} target="_blank" rel="noopener noreferrer" className="lml-btn-p gold">🎟 SeatGeek</a><a href={e.altTicketUrl} target="_blank" rel="noopener noreferrer" className="lml-btn-alt">StubHub</a></>
                  ):e.reservationUrl?(
                    <a href={e.reservationUrl} target="_blank" rel="noopener noreferrer" className="lml-btn-p" style={{background:"#1a3a1a",color:"#4caf50",border:"1px solid rgba(76,175,80,.4)"}}>{e.reservationLabel||"🍽 Reserve a Table"}</a>
                  ):e.ticketUrl?(
                    <a href={e.ticketUrl} target="_blank" rel="noopener noreferrer" className="lml-btn-p">{e.ticketLabel||"🎟 Get Tickets"}</a>
                  ):(
                    <button className="lml-btn-p" style={{background:"#1a3a1a",color:"#4caf50",border:"1px solid rgba(76,175,80,.3)"}}>✅ Free -- I'm In!</button>
                  )}
                  <button className={`lml-btn-s${isSaved?" saved":""}`} onClick={()=>toggleSave(e.id)}>{isSaved?"🔖":"🤍"}</button>
                  <button className="lml-btn-s">📤</button>
                </div>
                <p className="lml-disclosure">{isMajor?"Ticket links via SeatGeek & StubHub. Last Minute Lou may earn a commission.":e.reservationUrl?"Reservations via OpenTable. Last Minute Lou may earn a commission.":e.ticketUrl?"Tickets via SeatGeek. Last Minute Lou may earn a commission.":""}</p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
