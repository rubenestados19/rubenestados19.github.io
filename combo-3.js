window.SLM = window.SLM || {};
window.SLM['stage/announcement-bar/cyclic-scroll.js'] = window.SLM['stage/announcement-bar/cyclic-scroll.js'] || function () {
  const _exports = {};
  const debounce = window['SLM']['commons/utils/debounce.js'].default;
  class CyclicScroll {
    constructor(id) {
      this.container = document.querySelector(`#shopline-section-${id} .cyclic-scroll__container`);
      this.resizeFn = debounce(200, () => {
        this.fillItem();
      });
      this.init();
    }
    init() {
      this.fillItem();
      this.bindResize();
    }
    bindResize() {
      window.addEventListener('resize', this.resizeFn);
    }
    unbindResize() {
      window.removeEventListener('resize', this.resizeFn);
    }
    fillItem() {
      const inner = this.container && this.container.querySelectorAll('.cyclic-scroll__inner');
      const innerItem = inner && inner[0];
      if (!innerItem) return;
      if (!this.container.classList.contains('cyclic-scroll-stop')) {
        this.container.classList.add('cyclic-scroll-stop');
      }
      const innerWidth = innerItem.clientWidth;
      const windowWidth = window.innerWidth;
      const containerWidth = this.container.clientWidth;
      let num = Math.ceil((windowWidth + innerWidth - containerWidth) / innerWidth);
      if (num <= 0 || innerWidth <= 0 || !inner.length) {
        this.container.classList.remove('cyclic-scroll-stop');
        return;
      }
      while (num >= 0) {
        this.container.appendChild(innerItem.cloneNode(true));
        num -= 1;
      }
      this.container.classList.remove('cyclic-scroll-stop');
    }
  }
  _exports.default = CyclicScroll;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['stage/announcement-bar/index.js'] = window.SLM['stage/announcement-bar/index.js'] || function () {
  const _exports = {};
  const { registrySectionConstructor } = window['SLM']['theme-shared/utils/sectionsLoad/index.js'];
  const Swiper = window['swiper']['default'];
  const { Autoplay } = window['swiper'];
  const isMobile = window['SLM']['commons/utils/isMobile.js'].default;
  const CyclicScroll = window['SLM']['stage/announcement-bar/cyclic-scroll.js'].default;
  Swiper.use(Autoplay);
  class AnnouncementBar {
    constructor(container) {
      this.container = container;
      this.selectors = {
        announcementSlideItem: '.announcement-swiper-slide',
        announcementSwiperWrapper: '.announcement-bar__swiper'
      };
      this.classes = {
        activateSwiperClass: 'swiper-wrapper'
      };
      const displayMode = this.container.data('display-mode');
      const isCyclicScrollMode = Number(displayMode) === 5;
      if (isCyclicScrollMode) {
        this.activateCyclicScroll();
      } else {
        this.activateSwiper();
      }
    }
    onUnload() {
      this.swiperInstance && this.swiperInstance.destroy();
    }
    activateCyclicScroll() {
      const id = this.container.data('section-id');
      this.cyclicScrollInstance = new CyclicScroll(id);
    }
    activateSwiper() {
      const COMPACT = 2;
      const HORIZONTAL = 3;
      const $wrapper = this.container.find(this.selectors.announcementSwiperWrapper);
      let displayMode = this.container.data('display-mode');
      if (displayMode === COMPACT && isMobile()) {
        $wrapper.addClass(this.classes.activateSwiperClass);
        displayMode = 3;
      }
      if (!$wrapper.hasClass(this.classes.activateSwiperClass)) {
        return;
      }
      const direction = displayMode === HORIZONTAL ? 'horizontal' : 'vertical';
      const slides = this.container.find(this.selectors.announcementSlideItem);
      this.initSwiperHeight();
      this.swiperInstance = new Swiper(this.container[0], {
        init: true,
        loop: slides.length > 1,
        direction,
        autoplay: {
          delay: 5000
        },
        slideClass: 'announcement-swiper-slide',
        grabCursor: true
      });
    }
    onBlockDeselect() {
      this.swiperInstance && this.swiperInstance.autoplay.start();
    }
    onBlockSelect(e) {
      const {
        index = null
      } = e.detail;
      if (index !== null) {
        this.swiperInstance && this.swiperInstance.slideTo(index + 1);
      }
      this.swiperInstance && this.swiperInstance.autoplay.stop();
    }
    initSwiperHeight() {
      const height = $(this.container).height().toFixed(0);
      $(this.selectors.announcementSwiperWrapper).css('height', height);
    }
  }
  AnnouncementBar.type = 'announcement-bar';
  registrySectionConstructor(AnnouncementBar.type, AnnouncementBar);
  return _exports;
}();