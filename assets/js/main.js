AOS.init();

$(function () {
  const langSelect = new LanguageSelect("#langSelect", {
    onChange: function (lang) {
      console.log("Ngôn ngữ đã chọn:", lang);
    }
  });
  console.log("Giá trị ban đầu:", langSelect.getValue());

  footerAccordion();

  // Chạy lại khi resize (tránh lỗi khi xoay ngang/dọc)
  $(window).on("resize", function () {
    footerAccordion();
  });
});


function footerAccordion() {
  if ($(window).width() <= 992) {
    $(".footer-title").on("click", function () {
      const $content = $(this).next(".block-collapse");

      // Đóng tất cả block khác (accordion style)
      $(".block-collapse").not($content).slideUp().removeClass("active");
      $(".footer-title").not(this).removeClass("active");

      // Toggle block hiện tại
      $content.stop(true, true).slideToggle().toggleClass("active");
      $(this).toggleClass("active");
    });
  } else {
    $(".block-collapse").show().addClass("active");
    $(".footer-title").addClass("active").off("click");
  }
}
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

    // Toggle dropdown
    this.$selected.on("click", function () {
      self.$el.toggleClass("show-options");
    });

    // Chọn ngôn ngữ
    this.$options.on("click", function () {
      const img = $(this).find("img").attr("src");
      const text = $(this).data("lang");

      self.$selected.find("img").attr("src", img);
      self.$selected.find("span").text(text);

      self.$el.removeClass("show-options");

      // set lang attribute cho html
      $("html").attr("lang", text.toLowerCase());

      // callback
      self.onChange(text);
    });

    // Click ngoài thì đóng
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

class InfiniteScroller {
  constructor(containerId, speed = 1) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Không tìm thấy container với id: ${containerId}`);
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