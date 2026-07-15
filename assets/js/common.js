window.SudanTravelClock = (() => {
  let intervalId = null;

  function getLanguage() {
    return localStorage.getItem("sudanTravelLanguage") || "en";
  }

  function update() {
    const element = document.getElementById("liveClock");
    if (!element) return;

    const language = getLanguage();
    const locale = language === "ar" ? "ar-EG" : "en-GB";

    element.textContent = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date());
  }

  function start() {
    update();

    if (intervalId) {
      window.clearInterval(intervalId);
    }

    intervalId = window.setInterval(update, 1000);
  }

  return { start, update };
})();

document.addEventListener("DOMContentLoaded", () => {
  window.SudanTravelClock.start();
});
