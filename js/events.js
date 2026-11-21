const grid = document.getElementById("event-grid");
const searchInput = document.getElementById("search");
const typeSelect = document.getElementById("type-filter");
const dayGroup = document.querySelector(".day-filter");
const countText = document.getElementById("result-count");
const emptyMessage = document.getElementById("empty-message");

/* ---------- [Commit 8] Render cards with safe DOM methods ---------- */
function formatTime(time) {
  const parts = time.split(":");
  const hours = Number(parts[0]);
  const suffix = hours >= 12 ? "PM" : "AM";
  const display = hours % 12 || 12;
  return display + ":" + parts[1] + " " + suffix;
}

function createCard(event) {
  const item = document.createElement("li");
  const card = document.createElement("article");
  card.className = "card";

  const badge = document.createElement("span");
  badge.className = "badge badge-" + event.type;
  badge.textContent = event.type;

  const title = document.createElement("h2");
  title.textContent = event.title;

  const when = document.createElement("p");
  when.textContent = "Day " + event.day + " at " + formatTime(event.time);

  const venue = document.createElement("p");
  venue.textContent = event.venue;

  const seats = document.createElement("p");
  seats.textContent = event.seats + " seats";

  card.append(badge, title, when, venue, seats);

  /* ---------- [Commit 10] "Add to my schedule" button ---------- */
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn";

  function refreshButton() {
    const saved = isSaved(event.id);
    button.classList.toggle("is-saved", saved);
    button.textContent = saved ? "\u2605 Added (click to remove)" : "\u2605 Add to my schedule";
  }

  button.addEventListener("click", function () {
    toggleSaved(event.id);
    refreshButton();
  });

  refreshButton();
  card.appendChild(button);
  /* ---------- end [Commit 10] ---------- */

  item.appendChild(card);
  return item;
}

function renderEvents(list) {
  grid.replaceChildren(); // clear old cards
  list.forEach(function (event) {
    grid.appendChild(createCard(event));
  });
  emptyMessage.hidden = list.length > 0;
  countText.textContent = list.length + (list.length === 1 ? " event found" : " events found");
}

/* ---------- [Commit 9] Search + type + day filters, sorted by time ---------- */
function getFilteredEvents() {
  const query = searchInput.value.trim().toLowerCase();
  const type = typeSelect.value;
  const day = document.querySelector('input[name="day"]:checked').value;

  return events
    .filter(function (e) {
      const matchesText = query === "" || e.title.toLowerCase().includes(query);
      const matchesType = type === "all" || e.type === type;
      const matchesDay = day === "all" || e.day === Number(day);
      return matchesText && matchesType && matchesDay; // all three must pass
    })
    .sort(function (a, b) {
      return a.day - b.day || a.time.localeCompare(b.time); // day first, then time
    });
}

function update() {
  renderEvents(getFilteredEvents());
}

searchInput.addEventListener("input", update);
typeSelect.addEventListener("change", update);
dayGroup.addEventListener("change", update);
update();
