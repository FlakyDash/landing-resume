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
    var media = slot.querySelector("img, video");
    if (!media) return;

    var miss = function () { slot.classList.add("is-missing"); };
    var hit  = function () { slot.classList.remove("is-missing"); };

    media.addEventListener("error", miss);

    if (media.tagName === "VIDEO") {
      // у видео нет complete/naturalWidth — ждём первый кадр
      media.addEventListener("loadeddata", hit);
      return;
    }

    // картинка могла отвалиться ещё до навешивания обработчика
    if (media.complete && media.naturalWidth === 0) miss();
    media.addEventListener("load", hit);
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


/* =========================================================
   Липкое верхнее меню: подложка при скролле и гамбургер
   на узких экранах.
   ========================================================= */

(function () {
  "use strict";

  var nav = document.getElementById("nav");
  if (!nav) return;

  /* --- подложка появляется, как только страница сдвинулась --- */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
      ticking = false;
    });
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- гамбургер --- */
  var burger = nav.querySelector(".nav__burger");
  var menu = document.getElementById("nav-menu");
  if (!burger || !menu) return;

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  burger.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  // клик по разделу — меню закрывается и не перекрывает якорь
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      burger.focus();
    }
  });

  // клик мимо меню закрывает его
  document.addEventListener("click", function (e) {
    if (!nav.classList.contains("is-open")) return;
    if (!nav.contains(e.target)) setOpen(false);
  });

  // вернулись на широкий экран — панель больше не нужна
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1200) setOpen(false);
  });
})();


/* =========================================================
   Кастомный курсор.

   Точка следует за мышью кадр в кадр, кольцо догоняет её,
   смещаясь на часть расстояния каждый кадр. При наведении на
   интерактивное кольцо растёт и наливается акцентом.

   На тач-устройствах слои не создаются вовсе — там кастомный
   курсор только мешал бы.
   ========================================================= */

(function () {
  "use strict";

  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!fine.matches) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  var HOVER_SEL = "a, button, [role=\"button\"], .work, .pile__item";

  function layer(name) {
    var el = document.createElement("div");
    el.className = name;
    el.setAttribute("aria-hidden", "true");

    var shape = document.createElement("span");
    shape.className = name + "__shape";
    el.appendChild(shape);

    document.body.appendChild(el);
    return el;
  }

  var dot = layer("cursor-dot");
  var ring = layer("cursor-ring");

  var x = 0, y = 0;      // куда указывает мышь
  var rx = 0, ry = 0;    // где сейчас кольцо
  var started = false;

  function place(el, px, py) {
    el.style.transform = "translate3d(" + px + "px, " + py + "px, 0)";
  }

  function show(on) {
    dot.classList.toggle("is-ready", on);
    ring.classList.toggle("is-ready", on);
  }

  document.addEventListener("pointermove", function (e) {
    // событиями от пальца или пера кастомный курсор не управляем
    if (e.pointerType && e.pointerType !== "mouse") return;

    x = e.clientX;
    y = e.clientY;

    if (!started) {
      started = true;
      rx = x;
      ry = y;
      place(ring, rx, ry);
      show(true);
    }

    place(dot, x, y);
  }, { passive: true });

  function frame() {
    // при prefers-reduced-motion отставания нет: кольцо встаёт сразу
    var k = reduced.matches ? 1 : 0.18;

    rx += (x - rx) * k;
    ry += (y - ry) * k;
    place(ring, rx, ry);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  /* Пересчитываем состояние на каждом pointerover: так переход
     между вложенными элементами внутри одной ссылки не мигает. */
  document.addEventListener("pointerover", function (e) {
    var target = e.target;
    var on = !!(target && target.closest && target.closest(HOVER_SEL));
    dot.classList.toggle("is-hover", on);
    ring.classList.toggle("is-hover", on);
  });

  // мышь ушла за пределы окна — прячем, вернулась — показываем
  document.documentElement.addEventListener("pointerleave", function () {
    show(false);
  });

  document.documentElement.addEventListener("pointerenter", function () {
    if (started) show(true);
  });
})();


/* =========================================================
   Видеопортреты и prefers-reduced-motion.

   Кому движение мешает — видео замирает на первом кадре и
   ведёт себя как обычное фото. Controls намеренно не включаем.
   Настройку читаем на лету: если её поменяют, видео сразу
   остановится или поедет дальше, без перезагрузки.
   ========================================================= */

(function () {
  "use strict";

  var videos = document.querySelectorAll("video[autoplay]");
  if (!videos.length) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function freeze(video) {
    video.pause();
    // на нулевом кадре картинка нагляднее, чем на случайном месте
    if (video.currentTime > 0) {
      try { video.currentTime = 0; } catch (err) {}
    }
  }

  function apply() {
    Array.prototype.forEach.call(videos, function (video) {
      if (reduced.matches) {
        freeze(video);
      } else {
        var started = video.play();
        // play() отдаёт промис и может отклониться — например, если
        // браузер решил не проигрывать; для нас это не ошибка
        if (started && typeof started.catch === "function") {
          started.catch(function () {});
        }
      }
    });
  }

  Array.prototype.forEach.call(videos, function (video) {
    /* autoplay уже стоит в разметке, поэтому браузер попробует
       запустить видео сам — перехватываем и сразу тормозим. */
    video.addEventListener("play", function () {
      if (reduced.matches) freeze(video);
    });

    // первый кадр загрузился — замираем на нём
    video.addEventListener("loadeddata", function () {
      if (reduced.matches) freeze(video);
    });
  });

  apply();

  if (typeof reduced.addEventListener === "function") {
    reduced.addEventListener("change", apply);
  } else if (typeof reduced.addListener === "function") {
    reduced.addListener(apply);
  }
})();
