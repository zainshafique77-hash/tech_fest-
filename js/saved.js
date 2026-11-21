/* [Commit 10] Saved schedule, shared by every page (navbar count) */
const SAVED_KEY = "techfest-saved";

function getSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function isSaved(id) {
  return getSaved().includes(id);
}

function updateSavedCount() {
  const badge = document.getElementById("saved-count");
  if (badge) badge.textContent = String(getSaved().length);
}

// Adds the id if missing, removes it if present. Returns true when it is now saved.
function toggleSaved(id) {
  const list = getSaved();
  const index = list.indexOf(id);
  if (index === -1) {
    list.push(id);
  } else {
    list.splice(index, 1);
  }
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  } catch (e) {
    /* ignore */
  }
  updateSavedCount();
  return index === -1;
}

updateSavedCount();
