document.getElementById("year").textContent = new Date().getFullYear();

async function loadEvents(){
  const grid = document.getElementById("eventsGrid");
  const empty = document.getElementById("emptyState");

  try{
    const res = await fetch("data/soirees.json", { cache: "no-store" });
    if(!res.ok) throw new Error("JSON introuvable");
    const events = await res.json();

    const upcoming = (events || [])
      .filter(e => e && e.date)
      .sort((a,b) => new Date(a.date) - new Date(b.date));

    if(!upcoming.length){
      empty.style.display = "block";
      return;
    }

    grid.innerHTML = upcoming.map(e => `
      <article class="card event-card">
        <div class="event-top">
          <div>
            <div class="event-date">${formatDate(e.date)}${e.time ? ` • ${escapeHtml(e.time)}` : ""}</div>
            <h3 class="event-title">${escapeHtml(e.title || "Soirée à thème")}</h3>
          </div>
          ${e.badge ? `<div class="event-badge">${escapeHtml(e.badge)}</div>` : ""}
        </div>

        ${e.image ? `<div class="event-image"><img src="${escapeAttr(e.image)}" alt="${escapeAttr(e.title || "Soirée")}"></div>` : ""}

        ${e.description ? `<p class="event-desc">${escapeHtml(e.description)}</p>` : ""}

        <div class="event-meta">
          ${e.price ? `<div class="event-chip">💶 ${escapeHtml(e.price)}</div>` : ""}
          ${e.spots ? `<div class="event-chip">🎟️ ${escapeHtml(e.spots)}</div>` : ""}
          <div class="event-chip">📞 ${escapeHtml(e.reservation || "06 48 28 88 85")}</div>
        </div>

        <div class="event-actions">
          <a class="btn" href="tel:+33648288885">Réserver</a>
          <a class="mini" href="index.html#contact">Infos & contact</a>
        </div>
      </article>
    `).join("");

  }catch(err){
    empty.style.display = "block";
  }
}

function formatDate(iso){
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat("fr-FR", { weekday:"long", day:"2-digit", month:"long", year:"numeric" });
  return fmt.format(d).replace(/^./, c => c.toUpperCase());
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[s]));
}
function escapeAttr(str){
  return escapeHtml(str).replace(/"/g, "&quot;");
}

loadEvents();
