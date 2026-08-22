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


/* =========================================================
   Заглушки вместо ненайденных картинок.
   Пока файла нет, в кадре остаётся штриховка и подпись из
   data-placeholder; как только файл появится — картинка
   подхватится сама, править разметку не нужно.
   ========================================================= */

(function () {
  "use strict";

  var slots = document.querySelectorAll("[data-placeholder]");

  Array.prototype.forEach.call(slots, function (slot) {
    var img = slot.querySelector("img");
    if (!img) return;

    var miss = function () { slot.classList.add("is-missing"); };
    var hit  = function () { slot.classList.remove("is-missing"); };

    // картинка могла отвалиться ещё до навешивания обработчика
    if (img.complete && img.naturalWidth === 0) miss();

    img.addEventListener("error", miss);
    img.addEventListener("load", hit);
  });
})();


/* =========================================================
   «Куча» визуалов CS-Cart: плитки можно растаскивать мышью
   и пальцем. При захвате плитка поднимается над остальными
   и получает тень поглубже.
   ========================================================= */

(function () {
  "use strict";

  var pile = document.querySelector(".pile");
  if (!pile || !window.PointerEvent) return;

  var items = Array.prototype.slice.call(pile.querySelectorAll(".pile__item"));
  var topZ = 10;

  function clamp(v, min, max) {
    return v < min ? min : (v > max ? max : v);
  }

  function limits(item) {
    return {
      minX: -item.offsetLeft,
      maxX: pile.clientWidth - item.offsetLeft - item.offsetWidth,
      minY: -item.offsetTop,
      maxY: pile.clientHeight - item.offsetTop - item.offsetHeight
    };
  }

  /* При смене ширины экрана (поворот телефона) плитки пересчитываются
     под новую сетку, а старый сдвиг мог бы выкинуть их за край кучи —
     поэтому подтягиваем обратно в границы. */
  function reclamp() {
    items.forEach(function (item) {
      var dx = parseFloat(item.style.getPropertyValue("--dx"));
      var dy = parseFloat(item.style.getPropertyValue("--dy"));
      if (!dx && !dy) return;

      var lim = limits(item);
      item.style.setProperty("--dx", clamp(dx || 0, lim.minX, lim.maxX) + "px");
      item.style.setProperty("--dy", clamp(dy || 0, lim.minY, lim.maxY) + "px");
    });
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(reclamp, 150);
  });

  items.forEach(function (item) {
    var pointerId = null;
    var startX = 0, startY = 0, baseX = 0, baseY = 0;

    function offset(prop) {
      return parseFloat(item.style.getPropertyValue(prop)) || 0;
    }

    item.addEventListener("pointerdown", function (e) {
      if (e.button > 0) return;

      pointerId = e.pointerId;
      // капчур не критичен: если браузер его не даёт, перетаскивание
      // всё равно должно начаться
      try { item.setPointerCapture(pointerId); } catch (err) {}

      startX = e.clientX;
      startY = e.clientY;
      baseX = offset("--dx");
      baseY = offset("--dy");

      item.style.zIndex = ++topZ;
      item.classList.add("is-dragging");
      e.preventDefault();
    });

    item.addEventListener("pointermove", function (e) {
      if (e.pointerId !== pointerId) return;

      // не выпускаем плитку за пределы кучи
      var lim = limits(item);
      var dx = clamp(baseX + e.clientX - startX, lim.minX, lim.maxX);
      var dy = clamp(baseY + e.clientY - startY, lim.minY, lim.maxY);

      item.style.setProperty("--dx", dx + "px");
      item.style.setProperty("--dy", dy + "px");
    });

    function release(e) {
      if (e.pointerId !== pointerId) return;
      item.classList.remove("is-dragging");
      pointerId = null;
    }

    item.addEventListener("pointerup", release);
    item.addEventListener("pointercancel", release);

    // гасим родное перетаскивание картинки браузером
    item.addEventListener("dragstart", function (e) { e.preventDefault(); });
  });
})();
