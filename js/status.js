const schedule = {
  1: [[12,0,21,0]],
  3: [[12,0,21,0]],
  4: [[12,0,21,0]],
  5: [[12,0,25,0]],
  6: [[10,0,25,0]],
  0: [[12,0,21,0]],
};

const dayNames = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

function toMinutes(h, m){ return h*60 + m; }

function getNowLocal(){
  const d = new Date();
  return { date:d, day:d.getDay(), minutes: toMinutes(d.getHours(), d.getMinutes()) };
}

function isOpenAt(day, minutes){
  const slots = schedule[day] || [];
  for (const [h1,m1,h2,m2] of slots){
    const start = toMinutes(h1,m1);
    const end = toMinutes(h2,m2);
    if (minutes >= start && minutes < end) return { open:true, start, end };
  }
  return { open:false };
}

function fmtTime(minutes){
  const h = Math.floor(minutes/60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2,"0")}h${String(m).padStart(2,"0")}`;
}

function nextChangeInfo(){
  const {day, minutes} = getNowLocal();
  const now = isOpenAt(day, minutes);

  if (now.open){
    return { open:true, text:"Ouvert", next:`Fermé à ${fmtTime(now.end)}` };
  }

  for (let offset=0; offset<8; offset++){
    const d = (day + offset) % 7;
    const slots = schedule[d] || [];
    for (const [h1,m1,h2,m2] of slots){
      const start = toMinutes(h1,m1);
      if (offset === 0 && start <= minutes) continue;

      const when = offset === 0 ? "Aujourd’hui" : (offset === 1 ? "Demain" : dayNames[d]);
      return { open:false, text:"Fermé", next:`Ouvre ${when} à ${fmtTime(start)}` };
    }
  }

  return { open:false, text:"Fermé", next:"Horaires indisponibles" };
}

function renderStatus(){
  const pill = document.getElementById("openPill");
  const openText = document.getElementById("openText");
  const nextInfo = document.getElementById("nextInfo");
  const todayHint = document.getElementById("todayHint");
  const {date, day} = getNowLocal();

  const info = nextChangeInfo();
  openText.textContent = info.text;
  nextInfo.textContent = info.next;

  pill.classList.toggle("closed", !info.open);

  const todaySlots = schedule[day] || [];
  let todayStr = "Aujourd’hui : Fermé";
  if (todaySlots.length){
    todayStr = `Aujourd’hui (${dayNames[day]}) : ` + todaySlots
      .map(([h1,m1,h2,m2]) => `${fmtTime(toMinutes(h1,m1))} – ${fmtTime(toMinutes(h2,m2))}`)
      .join(" / ");
  }
  todayHint.textContent = todayStr;

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = date.getFullYear();
}

renderStatus();
setInterval(renderStatus, 30_000);
