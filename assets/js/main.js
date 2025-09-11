AOS.init();

$(function () {

});


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