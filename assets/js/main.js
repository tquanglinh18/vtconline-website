AOS.init();

$(function () {
  $('#btn-toggle-mobile').click(() => {
    $(".vtco-header-mobile").toggleClass("active");
    if ($(".vtco-header-mobile").hasClass("active")) {
      $("#btn-toggle-mobile img").attr("src", "./assets/images/ic_close_header.png");
    } else {
      $("#btn-toggle-mobile img").attr("src", "./assets/images/ic_menu_header.png");
    }
  })
  const langSelect = new LanguageSelect("#langSelect", {
    onChange: function (lang) {
      // console.log("Ngôn ngữ đã chọn:", lang);
    }
  });
  // console.log("Giá trị ban đầu:", langSelect.getValue());

  footerAccordion("#menu-mobile");
  footerAccordion("#vtco-footer");

  // Chạy lại khi resize (tránh lỗi khi xoay ngang/dọc)
  $(window).on("resize", function () {
    footerAccordion("#menu-mobile");
    footerAccordion("#vtco-footer");
  });
});

;

function footerAccordion(idContainer) {
  const $container = $(idContainer);

  if ($container.length === 0) return;

  if ($(window).width() <= 992) {
    $container.find(".block-title").off("click").on("click", function () {
      const $content = $(this).next(".block-collapse");

      $container.find(".block-collapse").not($content).slideUp().removeClass("active");
      $container.find(".block-title").not(this).removeClass("active");

      $content.stop(true, true).slideToggle().toggleClass("active");
      $(this).toggleClass("active");
    });
  } else {
    $container.find(".block-collapse").show().addClass("active");
    $container.find(".block-title").addClass("active").off("click");
  }
}

const togetherSwiper = new Swiper(".faq-swiper", {
  loop: false,
  centeredSlides: true,
  spaceBetween: 30,
  slidesPerView: 1,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

class LanguageSelect {
  constructor(selector, options = {}) {
    this.$el = $(selector);
    this.$selected = this.$el.find(".lang-selected");
    this.$options = this.$el.find(".lang-option");

    this.onChange = options.onChange || function (lang) { };

    this.bindEvents();
  }

  bindEvents() {
    const self = this;

    this.$selected.on("click", function () {
      self.$el.toggleClass("show-options");
    });

    this.$options.on("click", function () {
      const img = $(this).find("img").attr("src");
      const text = $(this).data("lang");

      self.$selected.find("img").attr("src", img);
      self.$selected.find("span").text(text);

      self.$el.removeClass("show-options");

      $("html").attr("lang", text.toLowerCase());

      self.onChange(text);
    });

    $(document).on("click", function (e) {
      if (!$(e.target).closest(self.$el).length) {
        self.$el.removeClass("show-options");
      }
    });
  }

  getValue() {
    return this.$selected.find("span").text();
  }

  setValue(lang) {
    const $option = this.$options.filter(`[data-lang="${lang}"]`);
    if ($option.length) {
      this.$selected.find("img").attr("src", $option.find("img").attr("src"));
      this.$selected.find("span").text(lang);
      $("html").attr("lang", lang.toLowerCase());
      this.onChange(lang);
    }
  }
}

const swiper = new Swiper('.vtco-swiper', {
  loop: true,
  autoplay: {
    delay: 3000,
  },
  pagination: {
    el: '.swiper-pagination',
  },
});

const ioeSwiper = new Swiper('#ioe-swiper', {
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    576: {
      slidesPerView: 2
    },
    768: {
      slidesPerView: 3
    },
    1200: {
      slidesPerView: 4
    }
  }
});

const betiaSwiper = new Swiper('#betia-swiper', {
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    576: {
      slidesPerView: 2
    },
    768: {
      slidesPerView: 3
    },
    1200: {
      slidesPerView: 4
    }
  }
});

class InfiniteScroller {
  constructor(containerId, speed = 1) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      // console.error(`Không tìm thấy container với id: ${containerId}`);
      return;
    }

    this.originalHTML = this.container.innerHTML;
    this.container.innerHTML += this.originalHTML;

    this.singleWidth = this.container.scrollWidth / 2;

    this.pos = 0;
    this.speed = speed;
    this.loop = this.loop.bind(this);

    this.loop();
  }

  loop() {
    this.pos -= this.speed;
    if (Math.abs(this.pos) >= this.singleWidth) {
      this.pos = 0;
    }
    this.container.style.transform = `translateX(${this.pos}px)`;
    requestAnimationFrame(this.loop);
  }
}

new InfiniteScroller("owl-vtco-partner", 0.5);

async function getJsonData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("✅ GetJsonData: Success",);
    return data;
  } catch (error) {
    console.error("❌ Lỗi JSON:", error);
    return [];
  }
}

function generateYearRanges(firstYear, lastYear, rangeYear = 5) {
  const yearRanges = [];

  let firstEnd = Math.ceil(firstYear / rangeYear) * rangeYear;

  if (firstEnd === firstYear) {
    firstEnd = firstEnd + (rangeYear - 1);
  }

  yearRanges.push(`${firstYear}–${firstEnd}`);

  let start = firstEnd + 1;
  while (start <= lastYear) {
    let end = start + rangeYear - 1;
    if (end > lastYear) end = "nay";
    yearRanges.push(`${start}–${end}`);
    start = end + 1;
  }

  return yearRanges;
}


async function renderTimelineStory() {
  const url = "../assets/data/journey-data.json";
  const result = await getJsonData(url);
  let dataIndex = 0;
  let bgColorIndex = 0;

  const yearColors = [
    '#72AD37',
    '#AAD814',
    '#F5D455',
    '#FF8F1F',
    '#E52427',
    '#3392FF',
    '#70B3FF',
    '#AE6CFF',
  ];

  const yearNav = document.getElementById("timeline-nav");
  let lastYear = result[0].year;
  let firstYear = result[result.length - 1].year;
  const rangeYear = 5;

  const lstRageYear = generateYearRanges(firstYear, lastYear, rangeYear)

  lstRageYear.reverse().forEach(rageYear => {
    const labelRangeYear = document.createElement("a")
    const parts = rageYear.split(/[–—−-]/);

    let lastYearOnRange = parts[parts.length - 1].trim();
    let firstYearOnRange = parts[0].trim();
    const nowYear = new Date().getFullYear();
    if (parts[parts.length - 1].trim() === 'nay') {
      lastYearOnRange = nowYear;
    }
    var startYearAttr = document.createAttribute("data-start");
    startYearAttr.value = `${firstYearOnRange}`;

    var lastYearAttr = document.createAttribute("data-end");
    lastYearAttr.value = `${lastYearOnRange}`;
    labelRangeYear.setAttributeNode(lastYearAttr)
    labelRangeYear.setAttributeNode(startYearAttr)
    labelRangeYear.innerText = `${rageYear}`
    labelRangeYear.href = `#year-label-${lastYearOnRange}`

    yearNav.appendChild(labelRangeYear)
  })

  result.forEach(year => {
    const yearBlock = document.createElement("div");
    const yearBlockAttr = document.createAttribute('curr-year');
    yearBlockAttr.value = `${year.year}`;
    yearBlock.setAttributeNode(yearBlockAttr)
    yearBlock.className = "timeline-year";
    const label = document.createElement("div");
    label.id = `year-label-${year.year}`
    label.className = "year-label";
    label.innerHTML = `<span>${year.year}</span>`;
    label.style.backgroundColor = yearColors[bgColorIndex % yearColors.length];
    yearBlock.appendChild(label);
    bgColorIndex++;

    const itemsWrap = document.createElement("div");
    itemsWrap.className = "timeline-items";
    year.events.forEach(event => {
      dataIndex++;
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.classList.add(dataIndex % 2 === 0 ? "content-right" : "content-left");
      item.innerText = event;
      itemsWrap.appendChild(item);
    });

    yearBlock.appendChild(itemsWrap);
    document.querySelector(".timeline-story").appendChild(yearBlock);

  });

  document.querySelectorAll(".timeline-year").forEach(el => {
    observer.observe(el);
  })

  document.querySelectorAll(".timeline-nav a").forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll(".timeline-nav a").forEach(link => {
        link.classList.remove("active");
      });
      el.classList = "active"
    })
  })
}

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {
    const lstNavYear = document.querySelectorAll(".timeline-nav a")
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      const firstInView = document.querySelector(".in-view").getAttribute("curr-year")
      lstNavYear.forEach((rangeYear) => {
        var endRage = rangeYear.getAttribute("data-end");
        var startRange = rangeYear.getAttribute("data-start")
        if (firstInView <= endRage && firstInView >= startRange) {
          rangeYear.classList.add("active")
        } else {
          rangeYear.classList.remove("active")
        }
      })

    } else {
      entry.target.classList.remove('in-view');
    }
  });
}, {
  threshold: 0.2
});