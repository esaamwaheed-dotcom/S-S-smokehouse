/* S&S Smokehouse — interactions, smoke shader, embers, menu */
(() => {
  "use strict";

  // Where form submissions go. Leave empty to show the on-page confirmation only (demo mode).
  // Set to e.g. "catering@yourdomain.com" to open the visitor's email app with the details filled in.
  const CONTACT_EMAIL = "";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ------------------------------------------------------------------ */
  /* Menu data (from the S&S menu sheets)                                */
  /* ------------------------------------------------------------------ */
  const MENU = [
    {
      id: "smokehouse", name: "The Smokehouse", line: "By the half-pound, straight off the pit.",
      items: [
        { n: "Brisket", d: "Prime brisket, salt-and-pepper bark, fourteen hours over post oak. Sliced lean or moist.", t: "pit" },
        { n: "Burnt Ends", d: "Point-end cubes, re-smoked and glazed until they fall into candy-dark bark." },
        { n: "Beef Plate Ribs — 3 Bone", d: "The dino rib. Three bones, a full plate, built for the table to share.", t: "pit" },
        { n: "Bone-In Lamb Shoulder", d: "Slow-smoked until it pulls from the bone with a fork. Our family's pride." },
        { n: "Beef + Lamb Sausage", d: "House-blend links with a snap, coarse grind, and a whisper of spice." },
        { n: "Smoked Chicken", d: "Half or whole bird. Crackling skin, juicy to the bone." },
        { n: "Beef Jerky", d: "Thin-sliced, smoke-dried, made for the road.", soon: true },
        { n: "Cold Cuts Plate", d: "Smoked, chilled, and sliced thin — a deli board the Texas way.", soon: true },
      ],
    },
    {
      id: "sandwiches", name: "Sandwiches", line: "Everything we smoke, between bread.",
      items: [
        { n: "THE ONE", d: "Our signature. The best of the pit stacked high — order it once and you'll understand the name.", t: "sig" },
        { n: "Smokehouse Sandwich — Pulled Lamb", d: "Smoked lamb shoulder, pulled by hand, sharp pickles and slaw." },
        { n: "Smokehouse Sandwich — Chopped Brisket", d: "Chopped brisket tossed in house sauce on a toasted bun." },
        { n: "Smokehouse Sandwich — Sliced Brisket", d: "Thick-cut brisket, onions, pickles. Simple and perfect." },
        { n: "Craft Brisket Burger", d: "Ground in-house from brisket trim, seared hard, stacked tall." },
        { n: "Brisket Shawarma", d: "Texas brisket meets the shawarma wrap — garlic sauce, pickles, warm bread." },
        { n: "Smokehouse Sandwich — Sausage", d: "Beef + lamb links, split and griddled, piled into a bun.", soon: true },
      ],
    },
    {
      id: "shareables", name: "Shareables", line: "For the middle of the table.",
      items: [
        { n: "Loaded Nachos", d: "Chopped brisket, queso, pickled jalapeños, pico, crema." },
        { n: "Loaded Waffle Fries", d: "Crisp waffle fries buried under burnt ends, cheese, and sauce." },
        { n: "Brisket Mac", d: "Our mac & cheese crowned with chopped brisket and a crunchy top." },
        { n: "Street Tacos", d: "Brisket or lamb on warm tortillas with onion, cilantro, and salsa." },
      ],
    },
    {
      id: "sides", name: "Sides", line: "The supporting cast nobody skips.",
      items: [
        { n: "Baked Beans", d: "Slow-cooked with brisket trimmings." },
        { n: "Mac & Cheese", d: "Three cheeses, baked creamy." },
        { n: "Potato Salad / Mashed Potatoes", d: "Mustard-style salad or buttery mash." },
        { n: "Cajun Saffron Rice / Jollof", d: "Two traditions, one fire — your pick." },
        { n: "S&S Slaw", d: "Crisp, tangy, the house way." },
        { n: "Charred Green Beans", d: "Blistered over the fire with garlic." },
        { n: "Waffle Fries", d: "Golden, crisp, salted right." },
        { n: "Sweet Potato Waffle Fries", d: "Sweet, smoky, a little spice." },
        { n: "Cornbread", d: "Skillet-baked with honey butter." },
        { n: "Texas Twinkie", d: "Jalapeño stuffed with brisket and cream cheese, wrapped and smoked." },
        { n: "Fried Okra", d: "Southern classic, cornmeal crust." },
        { n: "Creamed Corn", d: "Sweet corn, cream, and a touch of smoke." },
      ],
    },
    {
      id: "sweets", name: "Sweet Endings", line: "Save room. We mean it.",
      items: [
        { n: "Banana Pudding", d: "Vanilla custard, wafers, ripe bananas — just like home." },
        { n: "Peach Cobbler Dump Cake", d: "Warm peaches, buttery crumble, best with a scoop on top." },
      ],
    },
  ];

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function renderMenu() {
    const tabs = $("#menuTabs");
    const panels = $("#menuPanels");
    MENU.forEach((cat, ci) => {
      const tab = document.createElement("button");
      tab.className = "tab";
      tab.type = "button";
      tab.role = "tab";
      tab.id = `tab-${cat.id}`;
      tab.setAttribute("aria-controls", `panel-${cat.id}`);
      tab.setAttribute("aria-selected", ci === 0 ? "true" : "false");
      tab.tabIndex = ci === 0 ? 0 : -1;
      tab.innerHTML = `${esc(cat.name)}<small>${cat.items.length}</small>`;
      tabs.appendChild(tab);

      const panel = document.createElement("div");
      panel.className = "menu__panel" + (ci === 0 ? " is-active" : "");
      panel.id = `panel-${cat.id}`;
      panel.role = "tabpanel";
      panel.setAttribute("aria-labelledby", tab.id);
      panel.innerHTML = `
        <div class="menu__intro"><h3>${esc(cat.name)}</h3><p>${esc(cat.line)}</p></div>
        <div class="items">
          ${cat.items.map((it, i) => {
            const tag = it.soon ? `<span class="tag tag--soon">Coming soon</span>`
              : it.t === "sig" ? `<span class="tag tag--sig">Signature</span>`
              : it.t === "pit" ? `<span class="tag tag--pit">Pitmaster's pick</span>` : "<span></span>";
            return `<article class="item${it.soon ? " item--soon" : ""}" style="--i:${i}"><h4>${esc(it.n)}</h4>${tag}<p>${esc(it.d)}</p></article>`;
          }).join("")}
        </div>`;
      panels.appendChild(panel);
    });

    const allTabs = $$(".tab", tabs);
    const select = (tab, focus) => {
      allTabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        $("#" + t.getAttribute("aria-controls")).classList.toggle("is-active", on);
      });
      if (focus) tab.focus();
    };
    tabs.addEventListener("click", (e) => { const t = e.target.closest(".tab"); if (t) select(t); });
    tabs.addEventListener("keydown", (e) => {
      const i = allTabs.indexOf(document.activeElement);
      if (i < 0) return;
      if (e.key === "ArrowRight") select(allTabs[(i + 1) % allTabs.length], true);
      if (e.key === "ArrowLeft") select(allTabs[(i - 1 + allTabs.length) % allTabs.length], true);
    });
    // Links that jump to a specific tab
    $$("[data-tab]").forEach((a) => a.addEventListener("click", () => select($(`#tab-${a.dataset.tab}`))));
  }

  /* ------------------------------------------------------------------ */
  /* Hero title: split into characters for the staggered rise            */
  /* ------------------------------------------------------------------ */
  function splitTitle() {
    let k = 0;
    $$(".hero__title .split").forEach((el) => {
      const text = el.textContent;
      el.textContent = "";
      el.setAttribute("aria-hidden", "true");
      [...text].forEach((ch) => {
        const s = document.createElement("span");
        s.className = "char";
        s.textContent = ch;
        s.style.setProperty("--cd", `${0.15 + k++ * 0.035}s`);
        el.appendChild(s);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* WebGL smoke                                                          */
  /* ------------------------------------------------------------------ */
  function smoke(canvas) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!gl) return;
    const vs = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
    const fs = `
      precision highp float;
      uniform vec2 r; uniform float t; uniform vec2 m;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<6;i++){v+=a*n(p);p=R*p*2.02;a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/r; vec2 p=uv; p.x*=r.x/r.y;
        float T=t*.06;
        vec2 q=vec2(fbm(p*1.6+vec2(0.,-T*2.)),fbm(p*1.6+vec2(5.2,-T*2.3)));
        vec2 w=vec2(fbm(p*1.4+3.*q+vec2(1.7,-T*3.)+m*.15),fbm(p*1.4+3.*q+vec2(8.3,-T*2.6)));
        float s=fbm(p*1.2+2.5*w);
        float rise=smoothstep(1.05,.0,uv.y);
        float d=s*s*1.6*rise;
        vec3 smokeCol=mix(vec3(.08,.07,.065),vec3(.42,.38,.35),s);
        vec3 col=smokeCol*d;
        float heat=pow(1.-uv.y,3.2)*(.55+.45*n(vec2(p.x*3.,t*.8)));
        col+=vec3(1.,.38,.08)*heat*(.35+.9*s*s);
        col+=vec3(.7,.12,.1)*pow(1.-uv.y,1.6)*.12;
        float a=clamp(d+heat*.8,0.,1.);
        gl_FragColor=vec4(col,a);
      }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uM = gl.getUniformLocation(pr, "m");

    // Render at reduced resolution — smoke is soft, and this keeps it smooth on laptops/phones.
    const scale = 0.5;
    const resize = () => {
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    addEventListener("resize", resize);

    let mx = 0, my = 0, tx = 0, ty = 0;
    addEventListener("pointermove", (e) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });

    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    const start = performance.now();
    const frame = (now) => {
      if (visible) {
        mx += (tx - mx) * .03; my += (ty - my) * .03;
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uR, canvas.width, canvas.height);
        gl.uniform1f(uT, reduceMotion ? 20 : (now - start) / 1000);
        gl.uniform2f(uM, mx, my);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (!reduceMotion) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------ */
  /* Embers                                                               */
  /* ------------------------------------------------------------------ */
  function embers(canvas, density = 1) {
    const ctx = canvas.getContext("2d");
    if (!ctx || reduceMotion) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W, H, parts = [];
    const resize = () => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(140, (W * H) / 9000) * density);
      parts = Array.from({ length: count }, () => spawn(true));
    };
    const spawn = (anywhere) => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      r: Math.random() * 1.8 + .4,
      vy: -(Math.random() * .9 + .3),
      vx: (Math.random() - .5) * .3,
      life: Math.random() * 1,
      wob: Math.random() * Math.PI * 2,
      hue: 18 + Math.random() * 22,
    });
    resize();
    addEventListener("resize", resize);
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    const tick = () => {
      if (visible) {
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = "lighter";
        for (const p of parts) {
          p.wob += .03;
          p.x += p.vx + Math.sin(p.wob) * .35;
          p.y += p.vy;
          p.life += .004;
          const fade = Math.max(0, Math.min(1, p.y / H)) * (0.6 + 0.4 * Math.sin(p.wob * 3));
          if (p.y < -10 || fade <= 0.01) Object.assign(p, spawn(false));
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
          g.addColorStop(0, `hsla(${p.hue + 15},100%,75%,${fade})`);
          g.addColorStop(.3, `hsla(${p.hue},100%,55%,${fade * .6})`);
          g.addColorStop(1, `hsla(${p.hue},100%,50%,0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2); ctx.fill();
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ */
  /* Scroll: nav state, reveals, counters, pinned horizontal "Pit"       */
  /* ------------------------------------------------------------------ */
  function scrollFx() {
    const nav = $("#nav");
    let lastY = scrollY;

    const pit = $("#pit"), track = $("#pitTrack"), prog = $("#pitProgress");
    const pitUpdate = () => {
      const rect = pit.getBoundingClientRect();
      const total = pit.offsetHeight - innerHeight;
      const t = Math.min(1, Math.max(0, -rect.top / total));
      const dist = track.scrollWidth - innerWidth;
      track.style.transform = `translate3d(${-t * Math.max(0, dist)}px,0,0)`;
      prog.style.transform = `scaleX(${t})`;
    };
    // Shrink the pinned section's scroll length to match how wide the track actually is.
    const pitSize = () => {
      const dist = Math.max(0, track.scrollWidth - innerWidth);
      pit.style.height = `${innerHeight + dist * 1.1}px`;
      pitUpdate();
    };

    const onScroll = () => {
      const y = scrollY;
      nav.classList.toggle("is-scrolled", y > 40);
      nav.classList.toggle("is-hidden", y > lastY && y > innerHeight * .8 && !nav.classList.contains("is-open"));
      lastY = y;
      pitUpdate();
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", pitSize);
    pitSize();
    onScroll();

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        const num = e.target.querySelector("[data-count]");
        if (num) countUp(num);
        io.unobserve(e.target);
      });
    }, { threshold: .15, rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  }

  function countUp(el) {
    const end = +el.dataset.count;
    if (reduceMotion) { el.textContent = end; return; }
    const dur = 1600, t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 4)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------ */
  /* Nav (mobile), cursor glow, forms                                     */
  /* ------------------------------------------------------------------ */
  function navMobile() {
    const nav = $("#nav"), btn = $("#navToggle");
    const set = (open) => {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    };
    btn.addEventListener("click", () => set(!nav.classList.contains("is-open")));
    $$(".nav__links a").forEach((a) => a.addEventListener("click", () => set(false)));
  }

  function cursorGlow() {
    const g = $(".cursor-glow");
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || reduceMotion) return;
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; g.classList.add("is-on"); }, { passive: true });
    const loop = () => {
      cx += (x - cx) * .12; cy += (y - cy) * .12;
      g.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function forms() {
    const cf = $("#cateringForm");
    cf.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = $(".form__msg", cf);
      const name = cf.name.value.trim(), email = cf.email.value.trim();
      cf.name.classList.toggle("is-invalid", !name);
      cf.email.classList.toggle("is-invalid", !validEmail(email));
      if (!name || !validEmail(email)) { msg.textContent = "Add your name and a valid email so we can reach you."; return; }
      if (CONTACT_EMAIL) {
        const body = `Name: ${name}\nEmail: ${email}\nDate: ${cf.date.value}\nGuests: ${cf.guests.value}\n\n${cf.details.value}`;
        location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Catering request — " + name)}&body=${encodeURIComponent(body)}`;
      }
      msg.textContent = `Thanks, ${name.split(" ")[0]}. The pit crew will reach out within 48 hours.`;
      cf.reset();
    });

    const lf = $("#listForm");
    lf.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = $(".list__msg");
      const email = lf.email.value.trim();
      lf.email.classList.toggle("is-invalid", !validEmail(email));
      if (!validEmail(email)) { msg.textContent = "That email doesn't look quite right."; return; }
      if (CONTACT_EMAIL) location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Add me to the list")}&body=${encodeURIComponent(email)}`;
      msg.textContent = "You're on the list. Watch for the smoke signal.";
      lf.reset();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                 */
  /* ------------------------------------------------------------------ */
  document.body.classList.add("is-loading");
  $("#year").textContent = new Date().getFullYear();
  renderMenu();
  splitTitle();
  smoke($("#smoke"));
  embers($("#embers"), 1);
  embers($("#embers2"), .6);
  scrollFx();
  navMobile();
  cursorGlow();
  forms();

  const ready = () => {
    $("#loader").classList.add("is-done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
  };
  const minDelay = reduceMotion ? 0 : 1500;
  const t0 = performance.now();
  const go = () => setTimeout(ready, Math.max(0, minDelay - (performance.now() - t0)));
  if (document.readyState === "complete") go(); else addEventListener("load", go);
})();
