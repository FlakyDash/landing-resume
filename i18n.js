/* =========================================================
   Двуязычность RU / EN.

   Как это работает:
   - в разметке текстовые узлы помечены data-i18n="ключ"
     (подставляется как текст) или data-i18n-html="ключ"
     (подставляется как HTML — для строк с <em> и <br>);
   - здесь лежат обе версии каждой строки;
   - выбор языка запоминается в localStorage.

   Чтобы поправить текст — правьте строку здесь, в разметку
   лезть не нужно.

   ⚠ ПРОВЕРИТЬ — так помечены английские строки, которых не было
   в присланном списке переводов: я подставила прямой эквивалент.
   ========================================================= */

var I18N = {

  ru: {
    "a11y.skip": "Перейти к содержанию",

    /* --- Меню --- */
    "nav.brand":      "Валерия Семенюк",
    "nav.status":     "Открыта к предложениям",
    "nav.now":        "Чем занимаюсь сейчас",
    "nav.portfolio":  "Портфолио",
    "nav.education":  "Образование и языки",
    "nav.skills":     "Навыки",
    "nav.background": "База",
    "nav.contact":    "Контакты",
    "nav.cta":        "Написать в Telegram",

    /* --- Hero --- */
    "hero.title": "Веб-дизайнер: <em>от&nbsp;идеи до&nbsp;сайта</em><br>с Figma&nbsp;+ Claude&nbsp;Code",
    "hero.lead":  "Десять лет я выстраивала каталоги и контент для интернет-магазинов — теперь применяю этот опыт, чтобы создавать сайты и интерфейсы самой: в Figma, без кода, с помощью AI-инструментов.",

    /* --- Чем занимаюсь сейчас --- */
    "now.title": "Чем занимаюсь сейчас",
    "now.text":  "Устала до бесконечности копировать и вставлять карточки товаров. Больше всего мне нравилось другое — верстать сайты: в YMGroup я делала сайты для крупных брендов музыкальных инструментов (kawai.kz, pioneerdj.kz, beyerdynamic.kz), и я могла назвать свою работу любимой. Сейчас хочу вернуться в эту сферу — погружаюсь в Figma и Claude Code, прохожу курсы и осваиваю новые навыки в кратчайшие сроки, потому что наконец вновь занимаюсь тем, что по-настоящему <em>зажигает</em>.",

    /* --- Бегущая строка --- */
    "marquee.1": "обновляю устаревшие сайты",
    "marquee.2": "создаю аккуратный визуал",
    "marquee.3": "помогаю с написанием текста",

    /* --- Портфолио --- */
    "pf.title":  "Портфолио",
    "pf.figma":  "Макеты в Figma",
    "pf.work1":  "Лендинг для конференции Yandex Pet Day",
    "pf.work2":  "Главная страница интернет-магазина KEYBERRY",
    "pf.tilda":  "Сайты на Tilda",
    "pf.tilda1": "Личный бренд — Таролог",
    "pf.tilda2": "Тренажёрный зал — Фитнес-профи",
    "pf.cscart": "Визуалы сайтов на CS-Cart",
    "pf.note":   "Я с нуля разрабатывала дизайн-системы для сайтов yam.kz, ymusic.kz, kawai.kz, rolandmusic.kz, beyerdynamic.kz, pioneerdj.kz К сожалению, большинство из них владелец не сохранил, и они уже не работают. Это все что  у меня осталось ;(",

    /* --- Образование и языки --- */
    "edu.eyebrow":     "Образование",
    "edu.title":       "Образование и языки",
    "edu.formal":      "Формальное образование",
    "edu.uni":         "Омский государственный университет им. Ф. М. Достоевского",
    "edu.uniRole":     "Бакалавр",
    "edu.uniDesc":     "Бухгалтерский учёт, анализ и аудит.",
    "edu.college":     "Павлодарский химико-механический колледж",
    "edu.collegeRole": "Среднее профессиональное",
    "edu.collegeDesc": "Техник-технолог химической промышленности.",
    "edu.courses":     "Курсы",
    "edu.course1":     "Веб-вёрстка (HTML, CSS)",
    "edu.course2":     "Веб-дизайн и Figma с нуля до PRO",
    "edu.course3":     "Профессия Python-разработчик",
    "edu.languages":   "Языки",

    "lang.ru":      "Русский",
    "lang.ruLevel": "Родной",
    "lang.en":      "Английский",
    "lang.enLevel": "B1 — средний",
    "lang.es":      "Испанский",
    "lang.esLevel": "A2 — элементарный",

    /* --- Навыки --- */
    "skills.title": "Навыки",
    "skills.hard":  "Хард-скилы",
    "skills.h1":    "Figma (UI/UX, прототипирование)",
    "skills.h4":    "Claude Code / AI-инструменты для разработки",
    "skills.h5":    "ChatGPT (копирайтинг/анализ текстов)",
    "skills.h6":    "Python (базовый уровень)",
    "skills.h7":    "JavaScript (базовый уровень)",
    "skills.h11":   "SEO-оптимизация текста",
    "skills.h12":   "GitHub (базовый уровень)",
    "skills.h13":   "Vercel (базовый уровень)",
    "skills.soft":  "Софт-скилы",
    "skills.s1":    "Высокая внимательность к деталям",
    "skills.s2":    "Ответственность",
    "skills.s3":    "Самостоятельность",
    "skills.s4":    "Быстрая обучаемость",
    "skills.s5":    "Системный подход к работе",
    "skills.s6":    "Умение работать с большими объёмами информации",
    "skills.s7":    "Соблюдение сроков",

    /* --- База --- */
    "bg.eyebrow":  "Бэкграунд",
    "bg.title":    "База, на которой всё держится",
    "bg.intro":    "До дизайна я много лет отвечала за контент интернет-магазинов: <br>от карточек товара до SEO-описаний и каталогов на десятки тысяч позиций.",
    "bg.num1":     "46 000+",
    "bg.stat1":    "карточек товаров импортировано и обработано",
    "bg.num2":     "3 000+",
    "bg.stat2":    "карточек создано вручную с нуля",
    "bg.stat3":    "видеороликов подготовлено к публикации",
    "bg.role":     "Контент-менеджер",
    "bg.job1":     "ДН.РУ",
    "bg.job1City": "Москва",
    "bg.job1Desc": "Импорт и SEO-описания для каталога промышленного оборудования, обработка технической документации, подготовка ~200 видео для VK Видео.",
    "bg.job2City": "Алматы",
    "bg.job2Desc": "Вёрстка сайтов на CS-Cart по дизайн-коду брендов (yam.kz, kawai.kz, rolandmusic.kz), 3000+ карточек товаров вручную, баннеры в Photoshop, работа с маркетплейсами Kaspi и Ozon.",
    "bg.job3City": "Санкт-Петербург",
    "bg.job3Desc": "Наполнение каталога интернет-магазина, обработка изображений, анализ сайтов конкурентов.",

    /* --- Контакты --- */
    "contact.eyebrow": "Контакты",
    "contact.title":   "Открыта к различным проектам в дизайне.",
    "footer.copy":     "© 2026 Валерия Семенюк"
  },

  en: {
    "a11y.skip": "Skip to content",                    /* ⚠ ПРОВЕРИТЬ */

    /* --- Меню --- */
    "nav.brand":      "Valeriya Semenyuk",
    "nav.status":     "Open to offers",
    "nav.now":        "What I'm doing now",
    "nav.portfolio":  "Portfolio",
    "nav.education":  "Education & languages",
    "nav.skills":     "Skills",
    "nav.background": "Background",
    "nav.contact":    "Contact",
    "nav.cta":        "Message on Telegram",

    /* --- Hero --- */
    "hero.title": "Web designer: <em>from&nbsp;idea to&nbsp;site</em><br>with Figma&nbsp;+ Claude&nbsp;Code",
    "hero.lead":  "For ten years I built product catalogs and content for online stores — now I'm putting that eye for detail into creating sites and interfaces myself: in Figma, without code, with the help of AI tools.",

    /* --- Чем занимаюсь сейчас --- */
    "now.title": "What I'm doing now",
    "now.text":  "I got tired of endlessly copy-pasting product listings. What I loved most about that job was something else — building websites: at YMGroup I built sites for music-gear brands (kawai.kz, pioneerdj.kz, beyerdynamic.kz), and that was my favorite part of the work. Now I'm heading there on purpose — diving into Figma and Claude Code, taking courses, and learning as fast as I can, because I'm finally doing something that truly <em>lights me up</em>.",

    /* --- Бегущая строка --- */
    "marquee.1": "refreshing outdated websites",
    "marquee.2": "crafting clean visuals",
    "marquee.3": "helping with copywriting",

    /* --- Портфолио --- */
    "pf.title":  "Portfolio",
    "pf.figma":  "Figma layouts",
    "pf.work1":  "Landing page for the Yandex Pet Day conference",   /* ⚠ ПРОВЕРИТЬ */
    "pf.work2":  "KEYBERRY online store homepage",                   /* ⚠ ПРОВЕРИТЬ */
    "pf.tilda":  "Tilda websites",
    "pf.tilda1": "Personal brand — Tarot reader",
    "pf.tilda2": "Gym — Fitness Pro",
    "pf.cscart": "CS-Cart site visuals",                             /* ⚠ ПРОВЕРИТЬ */
    /* ⚠ ПРОВЕРИТЬ: первое и последнее предложение — мой перевод,
       середина взята из присланного списка */
    "pf.note":   "I designed the design systems for yam.kz, ymusic.kz, kawai.kz, rolandmusic.kz, beyerdynamic.kz and pioneerdj.kz from scratch. Unfortunately, the owner didn't keep most of these, and they no longer work. This is all I have left ;(",

    /* --- Образование и языки --- */
    "edu.eyebrow":     "Education",                       /* ⚠ ПРОВЕРИТЬ */
    "edu.title":       "Education & languages",
    "edu.formal":      "Formal education",                /* ⚠ ПРОВЕРИТЬ */
    "edu.uni":         "Dostoevsky Omsk State University",
    "edu.uniRole":     "Bachelor's degree",
    "edu.uniDesc":     "Accounting, Analysis and Audit.",
    "edu.college":     "PavlodarChemical-Mechanical College",
    "edu.collegeRole": "Vocational diploma",              /* ⚠ ПРОВЕРИТЬ */
    "edu.collegeDesc": "Chemical Industry Technician.",
    "edu.courses":     "Courses",                         /* ⚠ ПРОВЕРИТЬ */
    "edu.course1":     "Web Markup (HTML, CSS)",
    "edu.course2":     "Web Design and Figma from Zero to Pro",
    "edu.course3":     "Python Developer",
    "edu.languages":   "Languages",                       /* ⚠ ПРОВЕРИТЬ */

    "lang.ru":      "Russian",
    "lang.ruLevel": "native",
    "lang.en":      "English",
    "lang.enLevel": "B1, intermediate",
    "lang.es":      "Spanish",
    "lang.esLevel": "A2, elementary",

    /* --- Навыки --- */
    "skills.title": "Skills",
    "skills.hard":  "Hard skills",
    "skills.h1":    "Figma (UI/UX, prototyping)",
    "skills.h4":    "Claude Code / AI development tools",
    "skills.h5":    "ChatGPT (copywriting/text analysis)",           /* ⚠ ПРОВЕРИТЬ */
    "skills.h6":    "Python (basic level)",
    "skills.h7":    "JavaScript (basic level)",
    "skills.h11":   "SEO copywriting",
    "skills.h12":   "GitHub (basic level)",
    "skills.h13":   "Vercel (basic level)",
    "skills.soft":  "Soft skills",
    "skills.s1":    "Strong attention to detail",
    "skills.s2":    "Reliability",
    "skills.s3":    "Self-direction",
    "skills.s4":    "Fast learner",
    "skills.s5":    "Systematic approach to work",
    "skills.s6":    "Comfortable handling large volumes of information",
    "skills.s7":    "Meets deadlines",

    /* --- База --- */
    "bg.eyebrow":  "Background",                          /* ⚠ ПРОВЕРИТЬ */
    "bg.title":    "The foundation it's all built on",
    "bg.intro":    "Before design, I spent years running content for online stores — from product cards to SEO descriptions and catalogs spanning tens of thousands of listings. That's where I learned to work fast, systematically, and without slipping on the details.",
    "bg.num1":     "46,000+",
    "bg.stat1":    "product listings imported and processed",
    "bg.num2":     "3,000+",
    "bg.stat2":    "listings created by hand from scratch",
    "bg.stat3":    "videos prepared for publishing",
    "bg.role":     "Content Manager",
    "bg.job1":     "DN.RU",
    "bg.job1City": "Moscow",
    "bg.job1Desc": "Imports and SEO descriptions for an industrial-equipment catalog, processing manufacturer documentation, preparing ~200 videos for VK Video.",
    "bg.job2City": "Almaty",
    "bg.job2Desc": "Built CS-Cart sites to brand design specs (yam.kz, kawai.kz, rolandmusic.kz), 3,000+ product listings by hand, banners in Photoshop, worked with the Kaspi and Ozon marketplaces.",
    "bg.job3City": "Saint Petersburg",
    "bg.job3Desc": "Populating the online store catalog, image processing, competitor site analysis.",

    /* --- Контакты --- */
    "contact.eyebrow": "Contact",                         /* ⚠ ПРОВЕРИТЬ */
    "contact.title":   "Open to various design projects.",
    "footer.copy":     "© 2026 Valeriya Semenyuk"
  }
};


(function () {
  "use strict";

  var STORE = "landing-resume:lang";
  var DEFAULT = "ru";

  function dict(lang) {
    return I18N[lang] || I18N[DEFAULT];
  }

  function apply(lang) {
    var strings = dict(lang);

    document.documentElement.lang = lang;

    // обычный текст
    var plain = document.querySelectorAll("[data-i18n]");
    Array.prototype.forEach.call(plain, function (el) {
      var value = strings[el.getAttribute("data-i18n")];
      if (typeof value === "string") el.textContent = value;
    });

    // строки с разметкой внутри (<em>, <br>)
    var rich = document.querySelectorAll("[data-i18n-html]");
    Array.prototype.forEach.call(rich, function (el) {
      var value = strings[el.getAttribute("data-i18n-html")];
      if (typeof value === "string") el.innerHTML = value;
    });

    // состояние кнопок переключателя
    var buttons = document.querySelectorAll(".langswitch__btn");
    Array.prototype.forEach.call(buttons, function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    try { localStorage.setItem(STORE, lang); } catch (err) {}
  }

  var saved;
  try { saved = localStorage.getItem(STORE); } catch (err) {}

  // Русский по умолчанию; переключаем сразу, только если выбор уже сохранён,
  // чтобы не переписывать разметку зря на первой загрузке.
  if (saved && saved !== DEFAULT) {
    apply(saved);
  } else {
    apply(DEFAULT);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".langswitch__btn") : null;
    if (!btn) return;
    apply(btn.getAttribute("data-lang"));
  });
})();
