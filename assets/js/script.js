const languageButton = document.getElementById("languageButton");
const languageLabel = document.getElementById("languageLabel");

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
    ? "سفر السودان | الرئيسية"
    : "Sudan Travel | Home";

  window.SudanTravelClock?.update();
}

document.querySelectorAll(".company-button").forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.setItem(
      "selectedCompany",
      JSON.stringify({
        slug: button.dataset.companySlug,
        name: button.dataset.company
      })
    );

    localStorage.removeItem("selectedTrip");
    localStorage.removeItem("selectedSeat");

    window.location.href = "trips.html";
  });
});

languageButton.addEventListener("click", () => {
  applyLanguage(currentLanguage === "en" ? "ar" : "en");
});

applyLanguage(currentLanguage);
