const selectedTrip = JSON.parse(
  localStorage.getItem("selectedTrip") || "null"
);

const selectedSeat = JSON.parse(
  localStorage.getItem("selectedSeat") || "null"
);

const passengerData = JSON.parse(
  localStorage.getItem("passengerData") || "null"
);

const paymentData = JSON.parse(
  localStorage.getItem("paymentData") || "null"
);

const bookingReference =
  localStorage.getItem("temporaryBookingReference");

if (
  !selectedTrip ||
  !selectedSeat ||
  !passengerData ||
  !paymentData ||
  !bookingReference
) {
  window.location.href = "payment.html";
}

const languageButton = document.getElementById("languageButton");
const languageLabel = document.getElementById("languageLabel");
const printButton = document.getElementById("printButton");

let currentLanguage =
  localStorage.getItem("sudanTravelLanguage") || "en";

function paymentMethodLabel() {
  const labels = {
    bankak: {
      en: "Bankak",
      ar: "بنكك"
    },
    fawry: {
      en: "Fawry",
      ar: "فوري"
    },
    cashi: {
      en: "Cashi",
      ar: "كاشي"
    },
    "bank-transfer": {
      en: "Bank Transfer",
      ar: "تحويل بنكي"
    }
  };

  return labels[paymentData.method]?.[currentLanguage] || paymentData.method;
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
    ? "تم إرسال الحجز | سفر السودان"
    : "Booking Submitted | Sudan Travel";

  fillSuccessData();
  window.SudanTravelClock?.update();
}

function fillSuccessData() {
  document.getElementById("successReference").textContent =
    bookingReference;

  document.getElementById("successCompany").textContent =
    currentLanguage === "ar"
      ? selectedTrip.companyAr
      : selectedTrip.companyEn;

  document.getElementById("successRoute").textContent =
    currentLanguage === "ar"
      ? `${selectedTrip.fromAr} ← ${selectedTrip.toAr}`
      : `${selectedTrip.fromEn} → ${selectedTrip.toEn}`;

  document.getElementById("successDate").textContent =
    selectedTrip.travelDate;

  document.getElementById("successDeparture").textContent =
    selectedTrip.departure;

  document.getElementById("successSeat").textContent =
    selectedSeat.seatNumber;

  document.getElementById("successPassenger").textContent =
    passengerData.fullName;

  document.getElementById("successPhone").textContent =
    passengerData.phone;

  document.getElementById("successPaymentMethod").textContent =
    paymentMethodLabel();

  document.getElementById("successTransaction").textContent =
    paymentData.transactionNumber;

  document.getElementById("successTotal").textContent =
    `${Number(selectedTrip.price).toLocaleString()} SDG`;
}

printButton.addEventListener("click", () => {
  window.print();
});

languageButton.addEventListener("click", () => {
  applyLanguage(
    currentLanguage === "en" ? "ar" : "en"
  );
});

applyLanguage(currentLanguage);
