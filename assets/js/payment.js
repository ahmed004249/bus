const selectedTrip = JSON.parse(
  localStorage.getItem("selectedTrip") || "null"
);

const selectedSeat = JSON.parse(
  localStorage.getItem("selectedSeat") || "null"
);

const passengerData = JSON.parse(
  localStorage.getItem("passengerData") || "null"
);

const bookingReference =
  localStorage.getItem("temporaryBookingReference");

if (
  !selectedTrip ||
  !selectedSeat ||
  !selectedSeat.seatNumber ||
  !passengerData ||
  !bookingReference
) {
  window.location.href = "review.html";
}

const paymentAccounts = {
  bankak: {
    name: "Sudan Travel - Bankak",
    number: "1002003004"
  },
  fawry: {
    name: "Sudan Travel - Fawry",
    number: "2003004005"
  },
  cashi: {
    name: "Sudan Travel - Cashi",
    number: "3004005006"
  },
  bok: {
    name: "Sudan Travel - Bank of Khartoum",
    number: "4005006007"
  },
  faisal: {
    name: "Sudan Travel - Faisal Islamic Bank",
    number: "5006007008"
  }
};

const languageButton = document.getElementById("languageButton");
const languageLabel = document.getElementById("languageLabel");
const paymentMethods = [...document.querySelectorAll(".payment-method")];
const paymentDetails = document.getElementById("paymentDetails");
const bankSelectorWrap = document.getElementById("bankSelectorWrap");
const bankSelector = document.getElementById("bankSelector");
const accountName = document.getElementById("accountName");
const accountNumber = document.getElementById("accountNumber");
const copyAccountButton = document.getElementById("copyAccountButton");
const paymentForm = document.getElementById("paymentForm");
const paymentMessage = document.getElementById("paymentMessage");

let currentLanguage =
  localStorage.getItem("sudanTravelLanguage") || "en";

let selectedMethod = null;

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
    ? "الدفع | سفر السودان"
    : "Payment | Sudan Travel";

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

  document.getElementById("summaryPassenger").textContent =
    passengerData.fullName;

  document.getElementById("summaryTotal").textContent =
    `${Number(selectedTrip.price).toLocaleString()} SDG`;

  document.getElementById("summaryReference").textContent =
    bookingReference;
}

function showAccount(accountKey) {
  const account = paymentAccounts[accountKey];

  accountName.textContent = account.name;
  accountNumber.textContent = account.number;
}

paymentMethods.forEach((button) => {
  button.addEventListener("click", () => {
    paymentMethods.forEach((methodButton) => {
      methodButton.classList.remove("active");
    });

    button.classList.add("active");
    selectedMethod = button.dataset.method;

    paymentDetails.classList.add("show");

    if (selectedMethod === "bank-transfer") {
      bankSelectorWrap.style.display = "grid";
      showAccount(bankSelector.value);
    } else {
      bankSelectorWrap.style.display = "none";
      showAccount(selectedMethod);
    }

    paymentMessage.classList.remove("show");
  });
});

bankSelector.addEventListener("change", () => {
  if (selectedMethod === "bank-transfer") {
    showAccount(bankSelector.value);
  }
});

copyAccountButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(
      accountNumber.textContent
    );

    copyAccountButton.textContent =
      currentLanguage === "ar"
        ? "تم النسخ"
        : "Copied";
  } catch (error) {
    copyAccountButton.textContent =
      accountNumber.textContent;
  }

  setTimeout(() => {
    copyAccountButton.textContent =
      currentLanguage === "ar"
        ? "نسخ رقم الحساب"
        : "Copy Account Number";
  }, 1500);
});

paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedMethod) {
    paymentMessage.textContent =
      currentLanguage === "ar"
        ? "اختر طريقة الدفع أولاً."
        : "Choose a payment method first.";

    paymentMessage.classList.add("show");
    return;
  }

  if (!paymentForm.checkValidity()) {
    paymentForm.reportValidity();
    return;
  }

  const selectedBank =
    selectedMethod === "bank-transfer"
      ? bankSelector.value
      : null;

  const proofFile =
    document.getElementById("paymentProof").files[0];

  const paymentData = {
    method: selectedMethod,
    bank: selectedBank,
    accountName: accountName.textContent,
    accountNumber: accountNumber.textContent,
    transactionNumber:
      document.getElementById("transactionNumber").value.trim(),
    proofFileName: proofFile ? proofFile.name : "",
    submittedAt: new Date().toISOString()
  };

  localStorage.setItem(
    "paymentData",
    JSON.stringify(paymentData)
  );

  window.location.href = "success.html";
});

languageButton.addEventListener("click", () => {
  applyLanguage(
    currentLanguage === "en" ? "ar" : "en"
  );
});

applyLanguage(currentLanguage);
