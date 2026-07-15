const selectedTrip = JSON.parse(
  localStorage.getItem("selectedTrip") || "null"
);

const selectedSeat = JSON.parse(
  localStorage.getItem("selectedSeat") || "null"
);

if (
  !selectedTrip ||
  !selectedSeat ||
  !selectedSeat.seatNumber ||
  !selectedSeat.holdExpiresAt ||
  Date.now() >= selectedSeat.holdExpiresAt
) {
  window.location.href = "seats.html";
}

const languageButton = document.getElementById("languageButton");
const languageLabel = document.getElementById("languageLabel");
const passengerForm = document.getElementById("passengerForm");
const formMessage = document.getElementById("formMessage");

let currentLanguage =
  localStorage.getItem("sudanTravelLanguage") || "en";

function applyLanguage(language) {
  const isArabic = language === "ar";

  document.documentElement.lang = language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";

  document.querySelectorAll("[data-en][data-ar]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  languageLabel.textContent = isArabic ? "English" : "العربية";
  currentLanguage = language;

  localStorage.setItem("sudanTravelLanguage", language);

  document.title = isArabic
    ? "بيانات المسافر | سفر السودان"
    : "Passenger Details | Sudan Travel";

  fillSummary();
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

  document.getElementById("summarySeat").textContent =
    selectedSeat.seatNumber;

  document.getElementById("summaryPrice").textContent =
    `${Number(selectedTrip.price).toLocaleString()} SDG`;
}

function restoreSavedPassenger() {
  const savedPassenger = JSON.parse(
    localStorage.getItem("passengerData") || "null"
  );

  if (!savedPassenger) return;

  document.getElementById("fullName").value =
    savedPassenger.fullName || "";

  document.getElementById("phone").value =
    savedPassenger.phone || "";

  document.getElementById("idNumber").value =
    savedPassenger.idNumber || "";

  document.getElementById("gender").value =
    savedPassenger.gender || "";

  document.getElementById("emergencyPhone").value =
    savedPassenger.emergencyPhone || "";
}

passengerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!passengerForm.checkValidity()) {
    passengerForm.reportValidity();
    return;
  }

  const passengerData = {
    fullName: document.getElementById("fullName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    idNumber: document.getElementById("idNumber").value.trim(),
    gender: document.getElementById("gender").value,
    emergencyPhone:
      document.getElementById("emergencyPhone").value.trim()
  };

  localStorage.setItem(
    "passengerData",
    JSON.stringify(passengerData)
  );

  window.location.href = "review.html";
});

languageButton.addEventListener("click", () => {
  applyLanguage(currentLanguage === "en" ? "ar" : "en");
});

restoreSavedPassenger();
applyLanguage(currentLanguage);
