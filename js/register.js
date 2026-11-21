/* [Commit 12] Registration form: validation and summary card */
const form = document.getElementById("register-form");
const summary = document.getElementById("summary");
const summaryList = document.getElementById("summary-list");
const eventSelect = document.getElementById("event");

// Keep the HTML validation attributes, but let JavaScript show the messages
form.noValidate = true;

// Fill the event dropdown from the same data array used on the events page
events.forEach(function (e) {
  const option = document.createElement("option");
  option.value = String(e.id);
  option.textContent = "Day " + e.day + ": " + e.title;
  eventSelect.appendChild(option);
});

const emailPattern = /^[^\s@]+@[^\s@]+\.edu\.pk$/i; // must end with .edu.pk
const regNoPattern = /^F2026\d{6}$/;                // F2026 followed by 6 digits

function getParticipation() {
  return form.elements["participation"].value;
}

function setError(input, message) {
  const error = document.getElementById(input.id + "-error");
  if (message) {
    error.textContent = message;
    error.hidden = false;
    input.setAttribute("aria-invalid", "true");
  } else {
    error.textContent = "";
    error.hidden = true;
    input.removeAttribute("aria-invalid");
  }
  return message === "";
}

const checks = {
  fullname: function (el) {
    return el.value.trim().length >= 3 ? "" : "Enter your full name (at least 3 characters).";
  },
  email: function (el) {
    return emailPattern.test(el.value.trim()) ? "" : "Use your university email ending in .edu.pk.";
  },
  regno: function (el) {
    return regNoPattern.test(el.value.trim()) ? "" : "Use the format F2026 followed by 6 digits, e.g. F2026123456.";
  },
  event: function (el) {
    return el.value !== "" ? "" : "Choose an event.";
  },
  teamsize: function (el) {
    const size = Number(el.value);
    if (el.value.trim() === "" || !Number.isInteger(size) || size < 1 || size > 4) {
      return "Team size must be a whole number from 1 to 4.";
    }
    // Conditional rules that depend on the participation type
    if (getParticipation() === "individual" && size !== 1) {
      return "Individual participation means a team size of 1.";
    }
    if (getParticipation() === "team" && size < 2) {
      return "A team needs 2 to 4 members.";
    }
    return "";
  },
  tshirt: function (el) {
    return el.value !== "" ? "" : "Choose a T-shirt size.";
  },
  terms: function (el) {
    return el.checked ? "" : "You must accept the terms to register.";
  }
};

function validateField(id) {
  const input = document.getElementById(id);
  return setError(input, checks[id](input));
}

function showSummary() {
  summaryList.replaceChildren();
  const chosenEvent = eventSelect.options[eventSelect.selectedIndex].textContent;
  const rows = [
    ["Name", document.getElementById("fullname").value.trim()],
    ["Email", document.getElementById("email").value.trim()],
    ["Registration no.", document.getElementById("regno").value.trim()],
    ["Event", chosenEvent],
    ["Participation", getParticipation()],
    ["Team size", document.getElementById("teamsize").value],
    ["T-shirt", document.getElementById("tshirt").value]
  ];
  rows.forEach(function (row) {
    const dt = document.createElement("dt");
    dt.textContent = row[0];
    const dd = document.createElement("dd");
    dd.textContent = row[1];
    summaryList.append(dt, dd);
  });
  summary.hidden = false;
  summary.focus();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  summary.hidden = true;

  // Run every check (no early exit) so all errors show at once
  const results = Object.keys(checks).map(validateField);

  if (!results.every(Boolean)) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  showSummary();
  form.reset();
});

// Clear an error as soon as the user fixes the field
Object.keys(checks).forEach(function (id) {
  const input = document.getElementById(id);
  const eventName = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";
  input.addEventListener(eventName, function () {
    if (input.getAttribute("aria-invalid") === "true") validateField(id);
  });
});

// Changing the participation type can fix or break the team size
form.elements["participation"].forEach(function (radio) {
  radio.addEventListener("change", function () {
    const teamInput = document.getElementById("teamsize");
    if (teamInput.getAttribute("aria-invalid") === "true") validateField("teamsize");
  });
});
