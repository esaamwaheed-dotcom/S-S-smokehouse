/* S&S Smokehouse — inquiry page */
(() => {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* DELIVERY SETTINGS                                                    */
  /* Put the owner's email address here. Inquiries are then emailed to   */
  /* it through FormSubmit (formsubmit.co, free, no account needed).     */
  /* The very first inquiry triggers a one-time "activate this form"     */
  /* email to that address; click the link in it and every inquiry after */
  /* that arrives in the inbox as a formatted table.                     */
  /* While this is empty the page runs in preview mode: the form works   */
  /* end to end but nothing is sent.                                     */
  /* ------------------------------------------------------------------ */
  const OWNER_EMAIL = "";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const form = $("#inquiryForm");
  if (!form) return;
  const F = form.elements;

  const TYPES = {
    catering: { title: "Catering", subject: "Catering inquiry" },
    private: { title: "Private event", subject: "Private event inquiry" },
    list: { title: "Opening list", subject: "Opening list signup" },
    general: { title: "General", subject: "General inquiry" },
  };
  const isEvent = (t) => t === "catering" || t === "private";

  /* Menu chips, built from the same menu data as the landing page */
  const chipsEl = $("#menuChips");
  const menu = window.SS_MENU || [];
  const picks = [];
  const smokehouse = menu.find((c) => c.id === "smokehouse");
  if (smokehouse) smokehouse.items.filter((i) => !i.soon).forEach((i) => picks.push(i.n));
  menu.filter((c) => c.id !== "smokehouse").forEach((c) => picks.push(c.name));
  picks.forEach((name, i) => {
    const id = `menu-${i}`;
    const label = document.createElement("label");
    label.className = "chip";
    label.innerHTML = `<input type="checkbox" name="menu" id="${id}" /><span></span>`;
    label.querySelector("input").value = name;
    label.querySelector("span").textContent = name;
    chipsEl.appendChild(label);
  });

  /* Guest count: slider and number box stay in sync */
  const range = $("#f-guests-range"), num = $("#f-guests"), val = $("#guestsVal");
  const paintRange = () => {
    const pct = ((+range.value - +range.min) / (+range.max - +range.min)) * 100;
    range.style.setProperty("--fill", `${pct}%`);
  };
  const setGuests = (n, from) => {
    const v = Math.max(0, Math.round(+n || 0));
    if (from !== "num") num.value = v;
    if (from !== "range") range.value = Math.min(+range.max, Math.max(+range.min, v));
    val.textContent = v >= 1000 ? v.toLocaleString() : v;
    paintRange();
    updateSummary();
  };
  range.addEventListener("input", () => setGuests(range.value, "range"));
  num.addEventListener("input", () => setGuests(num.value, "num"));

  /* No past event dates */
  const today = new Date();
  $("#f-date").min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  /* Type switching */
  const currentType = () => F.type.value;
  const applyType = () => {
    const t = currentType();
    $$("[data-for]", form).forEach((el) => (el.hidden = !el.dataset.for.split(" ").includes(t)));
    $$("[data-label-for]", form).forEach((el) => (el.hidden = !el.dataset.labelFor.split(" ").includes(t)));
    $("#f-details").placeholder =
      t === "list" ? "Burnt ends? Lamb shoulder? THE ONE? Tell us." :
      t === "general" ? "How can we help?" :
      "Dietary needs, setup details, timing, questions…";
    $("#submitBtn").textContent = t === "list" ? "Join the list" : "Send inquiry";
    $("#formMsg").textContent = "";
    updateSummary();
  };
  form.addEventListener("change", (e) => { if (e.target.name === "type") applyType(); else updateSummary(); });
  form.addEventListener("input", updateSummary);

  // Deep links: inquire.html#catering, #private, #list, #general
  const fromHash = () => {
    const h = location.hash.replace("#", "");
    if (!TYPES[h]) return;
    $(`#type-${h}`).checked = true;
    $("#done").hidden = true;
    form.hidden = false;
    applyType();
  };
  addEventListener("hashchange", fromHash);

  /* Live summary */
  function fmtDate(v) {
    if (!v) return "";
    const d = new Date(v + "T12:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }
  function fmtTime(v) {
    if (!v) return "";
    const [h, m] = v.split(":").map(Number);
    return new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  function collect() {
    const t = currentType();
    const data = {
      type: TYPES[t].title,
      name: F.name.value.trim(),
      email: F.email.value.trim(),
      phone: F.phone.value.trim(),
    };
    if (t !== "list") data.organization = F.organization.value.trim();
    if (isEvent(t)) {
      Object.assign(data, {
        event_date: F.event_date.value,
        serving_time: F.event_time.value,
        occasion: F.occasion.value,
        guests: num.value,
        location: F.location.value.trim(),
        service_style: (form.querySelector('input[name="service"]:checked') || {}).value || "",
        menu_interests: $$('input[name="menu"]:checked', form).map((i) => i.value).join(", "),
        budget_per_guest: F.budget.value,
        heard_from: F.heard_from.value,
      });
    }
    data.details = F.details.value.trim();
    return data;
  }
  function updateSummary() {
    const t = currentType();
    const d = collect();
    $("#sumTitle").textContent = TYPES[t].title;
    const rows = [["Name", d.name], ["Email", d.email]];
    if (isEvent(t)) {
      rows.push(
        ["Date", [fmtDate(d.event_date), fmtTime(d.serving_time)].filter(Boolean).join(" · ")],
        ["Guests", d.guests ? `${(+d.guests).toLocaleString()} people` : ""],
        ["Occasion", d.occasion],
        ["Where", d.location],
        ["Service", d.service_style],
        ["Menu", d.menu_interests],
      );
    } else if (d.phone) rows.push(["Phone", d.phone]);
    const dl = $("#sumList");
    dl.innerHTML = "";
    rows.forEach(([k, v]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v || "Not added yet";
      if (!v) dd.className = "is-empty";
      row.append(dt, dd); dl.appendChild(row);
    });
  }

  /* Validation + submit */
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  function validate() {
    const t = currentType();
    const problems = [];
    const mark = (el, bad) => { el.classList.toggle("is-invalid", bad); if (bad) problems.push(el); };
    mark(F.name, !F.name.value.trim());
    mark(F.email, !validEmail(F.email.value.trim()));
    if (isEvent(t)) {
      mark(F.event_date, !F.event_date.value);
      mark(num, !(+num.value >= 10));
    } else { F.event_date.classList.remove("is-invalid"); num.classList.remove("is-invalid"); }
    mark(F.details, t === "general" && !F.details.value.trim());
    return problems;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $("#formMsg");
    const problems = validate();
    if (problems.length) {
      const t = currentType();
      msg.textContent = isEvent(t)
        ? "Please add your name, a valid email, the event date, and a guest count of at least 10."
        : t === "general" ? "Please add your name, a valid email, and a message."
        : "Please add your name and a valid email.";
      problems[0].focus();
      return;
    }
    const t = currentType();
    const data = collect();
    const btn = $("#submitBtn");
    let sent = false;

    if (OWNER_EMAIL) {
      btn.disabled = true;
      btn.textContent = "Sending…";
      msg.textContent = "";
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(OWNER_EMAIL)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: `${TYPES[t].subject} — ${data.name}${data.guests ? ` (${data.guests} guests)` : ""}`,
            _template: "table",
            _replyto: data.email,
            _captcha: "false",
            ...data,
          }),
        });
        if (!res.ok) throw new Error(res.status);
        sent = true;
      } catch {
        btn.disabled = false;
        applyType();
        msg.textContent = "We couldn't send that just now. Check your connection and try again.";
        return;
      }
      btn.disabled = false;
    }

    // Success screen
    $("#doneTitle").textContent = t === "list" ? "You're on the list." : "The fire's lit.";
    $("#doneText").textContent = t === "list"
      ? `Thanks, ${data.name.split(" ")[0]}. You'll hear from us the moment the opening date is set.`
      : `Thanks, ${data.name.split(" ")[0]}. The Sire & Sons team will get back to you at ${data.email} within 48 hours.`;
    const note = $("#doneNote");
    note.hidden = sent;
    note.textContent = sent ? "" : "Preview mode: this inquiry was not sent because the owner's email hasn't been set up yet.";
    form.hidden = true;
    $("#done").hidden = false;
    $("#done").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  $("#again").addEventListener("click", () => {
    const t = currentType();
    form.reset();
    $(`#type-${t}`).checked = true;
    setGuests(50);
    $$(".is-invalid", form).forEach((el) => el.classList.remove("is-invalid"));
    $("#done").hidden = true;
    form.hidden = false;
    applyType();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  setGuests(50);
  applyType();
  fromHash();
})();
