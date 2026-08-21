/* =========================================================
   Лёгкие детали: появление блоков при скролле.
   Всё отключается при prefers-reduced-motion: reduce.
   ========================================================= */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function showAll() {
    items.forEach(function (el) {
      el.style.setProperty("--d", "0ms");
      el.classList.add("is-visible");
    });
  }

  // Пользователь просил меньше движения — или браузер без IntersectionObserver.
  if (reduced.matches || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  /* Шаг задержки внутри одной группы: блоки проявляются друг за другом,
     а не все разом. Группа — ближайшая секция. */
  var STEP = 90;   // мс
  var MAX  = 360;  // потолок задержки, чтобы низ секции не «отставал»

  var groups = new WeakMap();

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;
      var group = el.closest("section, footer") || document.body;
      var index = groups.get(group) || 0;

      el.style.setProperty("--d", Math.min(index * STEP, MAX) + "ms");
      el.classList.add("is-visible");
      groups.set(group, index + 1);

      observer.unobserve(el);
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12
  });

  items.forEach(function (el) {
    observer.observe(el);
  });

  /* Страховка: если вкладка видна, но за 1.5 с ничего не проявилось
     (сбой observer'а), показываем контент без анимации. Скрытую вкладку
     не трогаем — там observer молчит штатно и сработает при открытии. */
  setTimeout(function () {
    if (document.visibilityState === "visible" &&
        !document.querySelector(".reveal.is-visible")) {
      observer.disconnect();
      showAll();
    }
  }, 1500);

  // Если настройку сменили на лету — показываем всё и перестаём наблюдать.
  var onChange = function () {
    if (reduced.matches) {
      observer.disconnect();
      showAll();
    }
  };

  if (typeof reduced.addEventListener === "function") {
    reduced.addEventListener("change", onChange);
  } else if (typeof reduced.addListener === "function") {
    reduced.addListener(onChange);
  }
})();
