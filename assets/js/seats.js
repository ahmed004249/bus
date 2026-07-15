const selectedTrip = JSON.parse(
  localStorage.getItem("selectedTrip") || "null"
);

if (!selectedTrip) {
  window.location.href = "index.html";
}

const languageButton = document.getElementById("languageButton");
const languageLabel = document.getElementById("languageLabel");
const selectedSeatText = document.getElementById("selectedSeatText");
const holdTimer = document.getElementById("holdTimer");
const continueButton = document.getElementById("continueButton");

let currentLanguage = localStorage.getItem("sudanTravelLanguage") || "en";
let selectedSeat = null;
let holdExpiresAt = null;
let timerInterval = null;


function applyLanguage(language) {
  currentLanguage = language;
  const isArabic = language === "ar";

  document.documentElement.lang = language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";

  document.querySelectorAll("[data-en][data-ar]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  languageLabel.textContent = isArabic ? "English" : "العربية";
  localStorage.setItem("sudanTravelLanguage", language);

  document.title = isArabic
    ? "اختيار المقعد | سفر السودان"
    : "Choose Seat | Sudan Travel";

  fillSummary();
  updateSelectedSeatLabel();
  updateHoldTimer();
  window.SudanTravelClock?.update();
}

function fillSummary() {
  document.getElementById("summaryCompany").textContent =
    currentLanguage === "ar"
      ? selectedTrip.companyAr
      : selectedTrip.companyEn;

  document.getElementById("summaryRoute").textContent =
    currentLanguage === "ar"
      ? `${selectedTrip.fromAr} ← ${selectedTrip.toAr}`
      : `${selectedTrip.fromEn} → ${selectedTrip.toEn}`;

  document.getElementById("summaryDate").textContent =
    selectedTrip.travelDate;

  document.getElementById("summaryDeparture").textContent =
    selectedTrip.departure;

  document.getElementById("summaryPrice").textContent =
    `${Number(selectedTrip.price).toLocaleString()} SDG`;
}

function updateSelectedSeatLabel() {
  if (!selectedSeat) {
    selectedSeatText.textContent =
      currentLanguage === "ar"
        ? "لم يتم اختيار مقعد بعد"
        : "No seat selected yet";
    return;
  }

  selectedSeatText.textContent =
    currentLanguage === "ar"
      ? `المقعد المختار: ${selectedSeat}`
      : `Selected seat: ${selectedSeat}`;
}

function clearHoldTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateHoldTimer() {
  if (!selectedSeat || !holdExpiresAt) {
    holdTimer.textContent = "";
    return;
  }

  const remaining = holdExpiresAt - Date.now();

  if (remaining <= 0) {
    holdTimer.textContent =
      currentLanguage === "ar"
        ? "انتهت مدة الحجز المؤقت."
        : "The temporary hold has expired.";
    return;
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const value =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  holdTimer.textContent =
    currentLanguage === "ar"
      ? `المقعد محفوظ لك مؤقتاً: ${value}`
      : `Seat held temporarily: ${value}`;
}

function startHoldTimer() {
  clearHoldTimer();
  updateHoldTimer();

  timerInterval = setInterval(() => {
    if (!holdExpiresAt || Date.now() < holdExpiresAt) {
      updateHoldTimer();
      return;
    }

    clearHoldTimer();

    document.querySelectorAll(".seat.selected").forEach((seat) => {
      seat.classList.remove("selected");
    });

    selectedSeat = null;
    holdExpiresAt = null;
    continueButton.disabled = true;
    localStorage.removeItem("selectedSeat");

    updateSelectedSeatLabel();
    updateHoldTimer();

    alert(
      currentLanguage === "ar"
        ? "انتهت مدة حجز المقعد. اختر مقعداً مرة أخرى."
        : "The seat hold expired. Please select a seat again."
    );
  }, 1000);
}

document.querySelectorAll(".seat").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".seat.selected").forEach((seat) => {
      seat.classList.remove("selected");
    });

    button.classList.add("selected");
    selectedSeat = button.dataset.seat;
    holdExpiresAt = Date.now() + 10 * 60 * 1000;
    continueButton.disabled = false;

    localStorage.setItem(
      "selectedSeat",
      JSON.stringify({
        seatNumber: selectedSeat,
        holdExpiresAt,
        trip: selectedTrip
      })
    );

    updateSelectedSeatLabel();
    startHoldTimer();
  });
});

document.getElementById("backButton").addEventListener("click", () => {
  window.location.href = "trips.html";
});

continueButton.addEventListener("click", () => {
  if (
    !selectedSeat ||
    !holdExpiresAt ||
    Date.now() >= holdExpiresAt
  ) {
    return;
  }

  window.location.href = "passenger.html";
});

languageButton.addEventListener("click", () => {
  applyLanguage(currentLanguage === "en" ? "ar" : "en");
});

applyLanguage(currentLanguage);
