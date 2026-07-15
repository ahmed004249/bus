const selectedTrip = JSON.parse(
  localStorage.getItem("selectedTrip") || "null"
);

const selectedSeat = JSON.parse(
  localStorage.getItem("selectedSeat") || "null"
);

const passengerData = JSON.parse(
  localStorage.getItem("passengerData") || "null"
);

if (
  !selectedTrip ||
  !selectedSeat ||
  !selectedSeat.seatNumber ||
  !passengerData
) {
  window.location.href = "passenger.html";
}

const languageButton = document.getElementById("languageButton");
const languageLabel = document.getElementById("languageLabel");
const termsAccepted = document.getElementById("termsAccepted");
const paymentButton = document.getElementById("paymentButton");
const reviewMessage = document.getElementById("reviewMessage");

let currentLanguage =
  localStorage.getItem("sudanTravelLanguage") || "en";

function getOrCreateTemporaryReference() {
  let reference = localStorage.getItem("temporaryBookingReference");

  if (reference) return reference;

  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("");

  const randomPart = String(
    Math.floor(Math.random() * 90000) + 10000
  );

  reference = `BK-${datePart}-${randomPart}`;

  localStorage.setItem(
    "temporaryBookingReference",
    reference
  );

  return reference;
}

function genderLabel(value) {
  if (currentLanguage === "ar") {
    return value === "male" ? "ذكر" : "أنثى";
  }

  return value === "male" ? "Male" : "Female";
}

function applyLanguage(language) {
  const isArabic = language === "ar";

  document.documentElement.lang = language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";

  document.querySelectorAll("[data-en][data-ar]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  languageLabel.textContent = isArabic ? "English" : "العربية";
  currentLanguage = language;

  localStorage.setItem(
    "sudanTravelLanguage",
    language
  );

  document.title = isArabic
    ? "مراجعة الحجز | سفر السودان"
    : "Review Booking | Sudan Travel";

  fillReviewData();
  window.SudanTravelClock?.update();
}

function fillReviewData() {
  document.getElementById("reviewCompany").textContent =
    currentLanguage === "ar"
      ? selectedTrip.companyAr
      : selectedTrip.companyEn;

  document.getElementById("reviewRoute").textContent =
    currentLanguage === "ar"
      ? `${selectedTrip.fromAr} ← ${selectedTrip.toAr}`
      : `${selectedTrip.fromEn} → ${selectedTrip.toEn}`;

  document.getElementById("reviewDate").textContent =
    selectedTrip.travelDate;

  document.getElementById("reviewDeparture").textContent =
    selectedTrip.departure;

  document.getElementById("reviewSeat").textContent =
    selectedSeat.seatNumber;

  document.getElementById("reviewFullName").textContent =
    passengerData.fullName;

  document.getElementById("reviewPhone").textContent =
    passengerData.phone;

  document.getElementById("reviewIdNumber").textContent =
    passengerData.idNumber;

  document.getElementById("reviewGender").textContent =
    genderLabel(passengerData.gender);

  document.getElementById("reviewEmergencyPhone").textContent =
    passengerData.emergencyPhone;

  const price =
    `${Number(selectedTrip.price).toLocaleString()} SDG`;

  document.getElementById("ticketPrice").textContent = price;
  document.getElementById("totalPrice").textContent = price;

  document.getElementById("temporaryReference").textContent =
    getOrCreateTemporaryReference();
}

termsAccepted.addEventListener("change", () => {
  paymentButton.disabled = !termsAccepted.checked;
});

paymentButton.addEventListener("click", () => {
  if (!termsAccepted.checked) return;
  window.location.href = "payment.html";
});

languageButton.addEventListener("click", () => {
  applyLanguage(
    currentLanguage === "en" ? "ar" : "en"
  );
});

applyLanguage(currentLanguage);
